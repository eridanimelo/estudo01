package com.eridanimelo.application.app.controller.security;

import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eridanimelo.application.app.model.util.dto.UserRequestDTO;
import com.eridanimelo.application.app.service.KeycloakPublicService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/public/users")
@Tag(name = "User Management", description = "APIs for managing users in Keycloak")
public class UserRootController {

    private final KeycloakPublicService service;

    public UserRootController(KeycloakPublicService service) {
        this.service = service;
    }

    @GetMapping("/teste")
    public void teste() {
        System.out.println("TESTEEEEEEEE");
    }

    @GetMapping("/teste2")
    public String teste2() {
        System.out.println("TESTEEEEEEEE");
        return "ola mundo";
    }

    @PostMapping("/create")
    @Operation(summary = "Create a new user root", description = "Creates a new user root in Keycloak with the provided details (username, first name, last name, email, and password).", responses = {
            @ApiResponse(responseCode = "201", description = "User created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<UserRepresentation> createUser(@RequestBody UserRequestDTO userRequestDTO) {

        UserRepresentation user = userRequestDTO.getUser();
        String password = userRequestDTO.getPassword();

        String id = service.createUserRoot(
                user.getUsername(),
                user.getEmail(),
                password, userRequestDTO.getTenentId());
        UserRepresentation obj = new UserRepresentation();
        obj.setId(id);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/users/" + id)
                .body(obj);
    }

}
