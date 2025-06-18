package com.eridanimelo.application.app.service.impl;

import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import com.eridanimelo.application.app.model.User;
import com.eridanimelo.application.app.model.UserRoot;
import com.eridanimelo.application.app.model.util.dto.UserRootDTO;
import com.eridanimelo.application.app.service.KeycloakPublicService;
import com.eridanimelo.application.app.service.UserRootService;
import com.eridanimelo.application.app.service.UserService;
import com.eridanimelo.application.config.kafka.UserKafka;

import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;

@Service
public class KeycloakPublicServiceImpl implements KeycloakPublicService {

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
    public String createUserRoot(String username, String email, String password, String tenantId) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);
        user.setAttributes(null);
        user.setEmailVerified(false);
        user.setRequiredActions(Arrays.asList("VERIFY_EMAIL"));

        // Adicionando o atributo tenantId
        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("subdomain", Collections.singletonList(tenantId));
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

                // Atribuir papel ao usuário
                assignRoleToUser(userId, "OWNER");

                UserKafka us = new UserKafka();
                us.setEmail(email);
                us.setIdKeycloak(userId);
                us.setSubdomain(tenantId);
                us.setRoot("true");
                createUserRoot(us);

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

    private void assignRoleToUser(String userId, String roleName) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
    }

    private void createUserRoot(UserKafka userKafka) {
        // Criar um DTO e preencher com os dados do UserKafka
        UserRootDTO dto = new UserRootDTO();
        dto.setEmail(userKafka.getEmail());
        dto.setIdKeycloak(userKafka.getIdKeycloak());
        dto.setSubdomain(userKafka.getSubdomain());

        // Salvar o DTO no serviço
        userRootService.save(dto);

        createUser(userKafka);
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
