package com.eridanimelo.application.config;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;

import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class JwtUtil {

    // Recupera o token JWT do cabeçalho Authorization
    public static String getTokenFromRequest() {
        // Recupera os atributos da requisição do contexto
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        // Verifica se os atributos de requisição estão presentes
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String authHeader = request.getHeader("Authorization");

            // Verifica se o cabeçalho de autorização está presente e começa com "Bearer "
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7); // Retorna o token JWT
            }
        }

        // Retorna null se não houver token ou contexto de requisição
        return null;
    }

    // Recupera o subdomínio do token JWT
    public static String getSubdomainFromToken() {
        String token = getTokenFromRequest();
        if (token != null) {
            try {
                JWTClaimsSet claimsSet = JWTParser.parse(token).getJWTClaimsSet();
                // Aqui, 'TID' é o nome do claim do subdomínio (ajuste conforme necessário)
                return claimsSet.getStringClaim("TID");
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    // Recupera o nome do usuário do token JWT
    public static String getUsernameFromToken() {
        String token = getTokenFromRequest();
        if (token != null) {
            try {
                JWTClaimsSet claimsSet = JWTParser.parse(token).getJWTClaimsSet();
                // 'preferred_username' é o nome do usuário no payload do token
                return claimsSet.getStringClaim("preferred_username");
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    // Recupera o email do usuário do token JWT
    public static String getEmailFromToken() {
        String token = getTokenFromRequest();
        if (token != null) {
            try {
                JWTClaimsSet claimsSet = JWTParser.parse(token).getJWTClaimsSet();
                // 'email' é o nome do claim de email no payload do token
                return claimsSet.getStringClaim("email");
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    // Recupera as permissões do usuário do token JWT
    public static String[] getPermissionsFromToken() {
        String token = getTokenFromRequest();
        if (token != null) {
            try {
                JWTClaimsSet claimsSet = JWTParser.parse(token).getJWTClaimsSet();
                // 'roles' ou 'permissions' pode ser o nome do claim para permissões (ajuste
                // conforme necessário)
                return claimsSet.getStringArrayClaim("roles");
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return new String[0]; // Retorna um array vazio caso não haja permissões
    }

    // Recupera o ID do usuário do token JWT
    public static String getUserIdFromToken() {
        String token = getTokenFromRequest();
        if (token != null) {
            try {
                JWTClaimsSet claimsSet = JWTParser.parse(token).getJWTClaimsSet();
                // 'sub' é geralmente o claim que contém o ID do usuário
                return claimsSet.getStringClaim("sub");
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
        return null; // Retorna null caso não consiga extrair o ID
    }
}
