package com.eridanimelo.application.config.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CustomJwtAuthenticationConverter implements Converter<Jwt, JwtAuthenticationToken> {

    @Override
    public JwtAuthenticationToken convert(@NonNull Jwt jwt) {
        // Converts the default JWT authorities
        JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        Collection<GrantedAuthority> authorities = defaultGrantedAuthoritiesConverter.convert(jwt);

        // Adds custom logic to map additional authorities, if necessary
        Collection<GrantedAuthority> customAuthorities = mapCustomAuthorities(jwt);
        if (customAuthorities != null) {
            authorities.addAll(customAuthorities);
        }

        // Set the principalName as a custom attribute, such as "preferred_username"
        String principalName = jwt.getClaim("preferred_username");
        if (principalName == null) {
            principalName = jwt.getSubject(); // Fallback to the default ID (sub)
        }

        return new JwtAuthenticationToken(jwt, authorities, principalName);
    }

    private Collection<GrantedAuthority> mapCustomAuthorities(Jwt jwt) {
        // Acessa o campo 'realm_access' do JWT e, em seguida, as 'roles' dentro desse
        // campo
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        // Verifica se 'realm_access' contém a chave 'roles' e extrai as roles
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            // Obtém as roles como uma lista de strings
            Object rolesObject = realmAccess.get("roles");

            // Verifica se o objeto é uma instância de List
            if (rolesObject instanceof List) {
                // Realiza o cast seguro para List<String>
                List<?> rolesList = (List<?>) rolesObject;

                // Verifica se todos os itens da lista são do tipo String
                if (rolesList.stream().allMatch(role -> role instanceof String)) {
                    // Converte as roles para GrantedAuthority, com o prefixo "ROLE_"
                    return rolesList.stream()
                            .map(role -> (GrantedAuthority) () -> "ROLE_" + ((String) role).toUpperCase())
                            .collect(Collectors.toList());
                }
            }
        }

        return List.of();
    }

}
