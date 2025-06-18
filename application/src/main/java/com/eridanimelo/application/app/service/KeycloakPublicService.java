package com.eridanimelo.application.app.service;

public interface KeycloakPublicService {
    String createUserRoot(String username, String email, String password,
            String tenantId);
}
