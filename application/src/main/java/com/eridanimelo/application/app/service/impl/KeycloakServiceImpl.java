package com.eridanimelo.application.app.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import org.springframework.stereotype.Service;

import com.eridanimelo.application.app.model.User;
import com.eridanimelo.application.app.model.UserRoot;

import com.eridanimelo.application.app.service.KeycloakService;
import com.eridanimelo.application.app.service.UserRootService;
import com.eridanimelo.application.app.service.UserService;
import com.eridanimelo.application.config.JwtUtil;
import com.eridanimelo.application.config.exception.AppException;
import com.eridanimelo.application.config.kafka.UserKafka;

import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;

@Service
public class KeycloakServiceImpl implements KeycloakService {

    @Value("${keycloak.server.url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client.id}")
    private String clientId;

    @Value("${keycloak.client.secret}")
    private String clientSecret;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    private Keycloak keycloak;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRootService userRootService;

    @PostConstruct
    public void init() {
        try {
            this.keycloak = KeycloakBuilder.builder().serverUrl(serverUrl).realm(realm)
                    .grantType(OAuth2Constants.CLIENT_CREDENTIALS).clientId(clientId).clientSecret(clientSecret)
                    .username(adminUsername).password(adminPassword).build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Keycloak client", e);
        }
    }

    @Override
    public String createUser(String username, String email, String password) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setAttributes(null);
        user.setEmailVerified(false);
        user.setRequiredActions(Arrays.asList("VERIFY_EMAIL"));

        // Adicionando o atributo tenantId
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("subdomain", Collections.singletonList(JwtUtil.getSubdomainFromToken()));
        user.setAttributes(attributes);

        String userId = null;
        boolean userCreated = false;

        try {
            // Criar usuário
            Response response = keycloak.realm(realm).users().create(user);
            if (response.getStatus() == 201) {
                userId = response.getLocation().getPath().replaceAll(".*/", "");
                userCreated = true;

                // Definir senha
                String decodedPassword = new String(Base64.getDecoder().decode(password));
                setUserPassword(userId, decodedPassword);

                // Enviar e-mail de verificação
                UserResource userResource = keycloak.realm(realm).users().get(userId);
                userResource.sendVerifyEmail();

                UserKafka us = new UserKafka();
                us.setEmail(email);
                us.setIdKeycloak(userId);
                us.setRoot("false");
                us.setSubdomain(JwtUtil.getSubdomainFromToken());
                createUser(us);

                return userId;
            } else {
                throw new RuntimeException("Failed to create user: " + response.getStatus());
            }
        } catch (Exception e) {
            // Realizar rollback
            if (userCreated && userId != null) {
                try {
                    keycloak.realm(realm).users().get(userId).remove();
                } catch (Exception rollbackException) {
                    throw new RuntimeException("Rollback failed: " + rollbackException.getMessage(), e);
                }
            }
            throw new RuntimeException("Error during user creation: " + e.getMessage(), e);
        }
    }

    private void setUserPassword(String userId, String password) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        keycloak.realm(realm).users().get(userId).resetPassword(credential);
    }

    @Override
    public void disableUser(String userId) {
        // Verifica se o usuário logado pode desabilitar o usuário
        checkIfUserCanBeModified(userId);

        // Desabilita o usuário
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setEnabled(false);
        keycloak.realm(realm).users().get(userId).update(user);
    }

    @Override
    public void enableUser(String userId) {
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setEnabled(true);
        keycloak.realm(realm).users().get(userId).update(user);
    }

    @Override
    public void assignRoleToUser(String userId, String roleName) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
    }

    @Override
    public Optional<UserRepresentation> findUserByEmail(String email) {
        List<UserRepresentation> users = keycloak.realm(realm).users().search(email, 0, 1);
        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    @Override
    public void deleteUser(String userId) {
        // Verifica se o usuário logado pode deletar o usuário
        checkIfUserCanBeModified(userId);

        // Deleta o usuário
        keycloak.realm(realm).users().get(userId).remove();
    }

    @Override
    public void resetUserPassword(String userId, String temporaryPassword) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);

        // Definir senha
        String decodedPassword = new String(Base64.getDecoder().decode(temporaryPassword));
        setUserPassword(userId, decodedPassword);

    }

    @Override
    public List<UserRepresentation> listAllUsersBySubdomain() {

        List<UserRepresentation> users = keycloak.realm(realm).users()
                .searchByAttributes("subdomain:" + JwtUtil.getSubdomainFromToken(), true);

        for (UserRepresentation user : users) {
            // Obtém a representação detalhada do usuário
            UserRepresentation detailedUser = keycloak.realm(realm).users().get(user.getId()).toRepresentation();

            // Verifica e inicializa os atributos, se necessário
            Map<String, List<String>> attributes = detailedUser.getAttributes();
            if (attributes == null) {
                attributes = new HashMap<>();
            }

            // Recupera o atributo TID (ou outros atributos customizados)
            List<String> tidList = attributes.get("subdomain");
            if (tidList != null && !tidList.isEmpty()) {
                // Adiciona o TID aos atributos do usuário
                attributes.put("TID", tidList);
            }

            // Atualiza os atributos no objeto original
            user.setAttributes(attributes);

            // Recupera as roles do usuário
            List<RoleRepresentation> roles = keycloak.realm(realm).users().get(user.getId()).roles().realmLevel()
                    .listEffective();

            List<String> filteredRoles = roles
                    .stream().map(RoleRepresentation::getName).filter(roleName -> !roleName.equals("uma_authorization")
                            && !roleName.equals("offline_access") && !roleName.equals("default-roles-user-api"))
                    .collect(Collectors.toList());

            // Adiciona as roles aos atributos
            attributes.put("roles", filteredRoles);
        }

        return users;

    }

    @Override
    public void removeUserRole(String userId, String roleName) {
        if ("OWNER".equals(roleName)) {
            throw new AppException("Cannot remove " + roleName + " role", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().remove(Collections.singletonList(role));
    }

    @Override
    public List<RoleRepresentation> listAllRoles() {
        List<RoleRepresentation> allRoles = keycloak.realm(realm).roles().list();

        // Definir um conjunto com os nomes das roles a serem excluídas
        Set<String> excludedRoles = Set.of(
                "uma_authorization",
                "offline_access",
                "OWNER",
                "default-roles-user-api");

        // Filtra as roles excluindo as que estão no conjunto
        return allRoles.stream()
                .filter(role -> !excludedRoles.contains(role.getName()))
                .collect(Collectors.toList());
    }

    private void checkIfUserCanBeModified(String userId) {
        // Recupera o ID do usuário logado
        String loggedInUserId = JwtUtil.getUserIdFromToken();

        // Verifica se o usuário logado está tentando desabilitar ou deletar a si mesmo
        if (userId.equals(loggedInUserId)) {
            throw new AppException("You cannot modify your own account.", HttpStatus.FORBIDDEN);
        }

        // Recupera os detalhes do usuário a ser modificado
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();

        List<RoleRepresentation> roles = keycloak.realm(realm).users().get(user.getId()).roles().realmLevel()
                .listEffective();

        List<String> filteredRoles = roles
                .stream().map(RoleRepresentation::getName).filter(roleName -> !roleName.equals("uma_authorization")
                        && !roleName.equals("offline_access") && !roleName.equals("default-roles-user-api"))
                .collect(Collectors.toList());

        // Verifica se o usuário tem o perfil OWNER
        if (Objects.nonNull(filteredRoles) && filteredRoles.contains("OWNER")) {
            throw new AppException("You cannot modify the OWNER account.", HttpStatus.FORBIDDEN);
        }
    }

    @Override
    public void toggleConfigureTOTP(String userId) {
        try {
            // Obter o recurso do usuário pelo ID
            UserResource userResource = keycloak.realm(realm).users().get(userId);
            UserRepresentation userRepresentation = userResource.toRepresentation();

            // Obter ou inicializar a lista de requiredActions
            List<String> requiredActions = Optional.ofNullable(userRepresentation.getRequiredActions())
                    .orElse(new ArrayList<>());
            Map<String, List<String>> attributes = Optional.ofNullable(userRepresentation.getAttributes())
                    .orElse(new HashMap<>());

            // Verificar o estado de 'otp_enabled' e determinar a ativação do TOTP
            boolean isTotpEnabled = isOtpEnabled(attributes);

            // Alternar o estado de 'CONFIGURE_TOTP' baseado no valor de 'otp_enabled'
            updateRequiredActions(isTotpEnabled, requiredActions);

            // Remover credenciais OTP se TOTP estiver desativado
            if (!isTotpEnabled) {
                removeOtpCredentials(userResource);
            }

            // Atualizar as informações do usuário
            updateUserAttributes(userResource, userRepresentation, requiredActions, attributes, isTotpEnabled);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Erro ao alternar CONFIGURE_TOTP para o usuário com ID " + userId + ": " + e.getMessage(), e);
        }
    }

    private boolean isOtpEnabled(Map<String, List<String>> attributes) {
        // Verificar o estado de 'otp_enabled' e inverter a lógica
        return Optional.ofNullable(attributes.get("otp_enabled"))
                .map(value -> !"true".equalsIgnoreCase(value.get(0)))
                .orElse(true); // Default para true
    }

    private void updateRequiredActions(boolean isTotpEnabled, List<String> requiredActions) {
        if (isTotpEnabled && !requiredActions.contains("CONFIGURE_TOTP")) {
            requiredActions.add("CONFIGURE_TOTP"); // Ativar TOTP
        } else if (!isTotpEnabled) {
            requiredActions.remove("CONFIGURE_TOTP"); // Desativar TOTP
        }
    }

    private void removeOtpCredentials(UserResource userResource) {
        try {
            List<CredentialRepresentation> credentials = userResource.credentials();

            // Filtrar e remover credenciais OTP (TOTP)
            credentials.stream()
                    .filter(credential -> "otp".equals(credential.getType()))
                    .forEach(credential -> {
                        userResource.removeCredential(credential.getId());
                        System.out.println("Credencial OTP removida.");
                    });
        } catch (Exception e) {
            System.err.println("Erro ao remover credenciais OTP: " + e.getMessage());
        }
    }

    private void updateUserAttributes(UserResource userResource, UserRepresentation userRepresentation,
            List<String> requiredActions, Map<String, List<String>> attributes,
            boolean isTotpEnabled) {
        // Atualizar a lista de requiredActions do usuário
        userRepresentation.setRequiredActions(requiredActions);

        // Atualizar o atributo 'otp_enabled'
        attributes.put("otp_enabled", Collections.singletonList(String.valueOf(isTotpEnabled)));
        userRepresentation.setAttributes(attributes);

        // Salvar as alterações no usuário
        userResource.update(userRepresentation);
    }

    private void createUser(UserKafka userKafka) {
        Long idUr = userRootService.findIdBySubdomain(userKafka.getSubdomain());
        User obj = new User();
        obj.setEmail(userKafka.getEmail());
        obj.setIdKeycloak(userKafka.getIdKeycloak());

        obj.setUserRoot(new UserRoot(idUr));
        userService.saveEntity(obj);
    }

}
