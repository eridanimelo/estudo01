package com.eridanimelo.application.app.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users in Keycloak")
public class UserController {

        @GetMapping("/user-info")
        public Map<String, Object> getUserInfo() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication.getPrincipal() instanceof Jwt jwt) {
                        return jwt.getClaims(); // Retorna todos os claims do JWT
                }
                return Map.of("error", "No JWT available");
        }
}
