package com.eridanimelo.application.app.controller.security;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.eridanimelo.application.app.model.util.dto.UserRequestDTO;
import com.eridanimelo.application.app.service.KeycloakService;
import com.eridanimelo.application.config.JwtUtil;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-sercurity")
@Tag(name = "User Management", description = "APIs for managing users in Keycloak")
public class UserSecurityController {

        private final KeycloakService service;

        public UserSecurityController(KeycloakService service) {
                this.service = service;
        }

        @PostMapping("/create")
        @Operation(summary = "Create a new user", description = "Creates a new user in Keycloak with the provided details (username, first name, last name, email, and password).", responses = {
                        @ApiResponse(responseCode = "201", description = "User created successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public ResponseEntity<UserRepresentation> createUser(@RequestBody UserRequestDTO userRequestDTO) {
                UserRepresentation user = userRequestDTO.getUser();
                String password = userRequestDTO.getPassword();

                String id = service.createUser(
                                user.getUsername(),
                                user.getEmail(),
                                password);

                UserRepresentation obj = new UserRepresentation();
                obj.setId(id);
                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .header("Location", "/users/" + id)
                                .body(obj);
        }

        @PostMapping("/reset-password")
        @Operation(summary = "Reset user password", description = "Resets the password for the user identified by their email address in Keycloak. The new password must be provided.", responses = {
                        @ApiResponse(responseCode = "200", description = "Password reset successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void resetPassword(@RequestBody UserRequestDTO userRequestDTO) {
                String email = userRequestDTO.getUser().getEmail();
                String password = userRequestDTO.getPassword();

                Optional<UserRepresentation> userOptional = service.findUserByEmail(email);
                if (userOptional.isPresent()) {
                        String userId = userOptional.get().getId();
                        service.resetUserPassword(userId, password);
                } else {
                        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
                }
        }

        @DeleteMapping("/delete")
        @Operation(summary = "Delete a user", description = "Deletes the user identified by their userId from Keycloak.", responses = {
                        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void deleteUser(@RequestParam String userId) {
                service.deleteUser(userId);
        }

        @PreAuthorize("hasRole('ROLE_OWNER')")
        @PutMapping("/disable")
        @Operation(summary = "Disable a user", description = "Disables the user identified by their userId in Keycloak, preventing further login attempts.", responses = {
                        @ApiResponse(responseCode = "200", description = "User disabled successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void disableUser(@RequestParam String userId) {
                service.disableUser(userId);
        }

        @PutMapping("/enable")
        @Operation(summary = "Enable a user", description = "Enable the user identified by their userId address in Keycloak, preventing further login attempts.", responses = {
                        @ApiResponse(responseCode = "200", description = "User Enable successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void enableUser(@RequestParam String userId) {
                service.enableUser(userId);
        }

        @GetMapping("/list")
        @Operation(summary = "List all users", description = "Retrieves a list of all users by subdomain logged in in the Keycloak realm.", responses = {
                        @ApiResponse(responseCode = "200", description = "List of users retrieved successfully"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public List<UserRepresentation> listAllUsersBySubdomain() {
                return service.listAllUsersBySubdomain();
        }

        @GetMapping("/roles")
        @Operation(summary = "List all roles", description = "Retrieves a list of all roles in the Keycloak realm.", responses = {
                        @ApiResponse(responseCode = "200", description = "List of roles retrieved successfully"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public List<RoleRepresentation> listAllRoles() {
                return service.listAllRoles();
        }

        @PostMapping("/{userId}/roles/add")
        @Operation(summary = "Assign a role to a user", description = "Assigns a specified role to the user identified by userId in Keycloak.", responses = {
                        @ApiResponse(responseCode = "200", description = "Role assigned successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "404", description = "User or role not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void addUserRole(
                        @PathVariable String userId,
                        @RequestParam String roleName) {
                service.assignRoleToUser(userId, roleName);
        }

        @PostMapping("/{userId}/roles/remove")
        @Operation(summary = "Remove a role to a user", description = "Remove a specified role to the user identified by userId in Keycloak.", responses = {
                        @ApiResponse(responseCode = "200", description = "Role remove successfully"),
                        @ApiResponse(responseCode = "400", description = "Invalid input data"),
                        @ApiResponse(responseCode = "404", description = "User or role not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void removeUserRole(
                        @PathVariable String userId,
                        @RequestParam String roleName) {
                service.removeUserRole(userId, roleName);
        }

        @PostMapping("/{userId}/totp/toggle")
        @Operation(summary = "Toggle CONFIGURE_TOTP for a user", description = "Toggles the CONFIGURE_TOTP required action for the user identified by userId in Keycloak.", responses = {
                        @ApiResponse(responseCode = "200", description = "TOTP toggled successfully"),
                        @ApiResponse(responseCode = "404", description = "User not found"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void toggleUserTOTP(@PathVariable String userId) {
                service.toggleConfigureTOTP(userId);
        }

        @PostMapping("/totp/toggle")
        @Operation(summary = "Toggle CONFIGURE_TOTP for the logged-in user", description = "Toggles the CONFIGURE_TOTP required action for the currently logged-in user in Keycloak.", responses = {
                        @ApiResponse(responseCode = "200", description = "TOTP toggled successfully"),
                        @ApiResponse(responseCode = "500", description = "Internal server error")
        })
        public void toggleLoggedInUserTOTP() {
                String userId = JwtUtil.getUserIdFromToken();
                service.toggleConfigureTOTP(userId);
        }

}
