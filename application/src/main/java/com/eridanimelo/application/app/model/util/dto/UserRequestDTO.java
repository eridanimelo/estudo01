package com.eridanimelo.application.app.model.util.dto;

import org.keycloak.representations.idm.UserRepresentation;

public class UserRequestDTO {
    private UserRepresentation user;
    private String password;
    private String tenentId;

    public String getTenentId() {
        return tenentId;
    }

    public void setTenentId(String tenentId) {
        this.tenentId = tenentId;
    }

    public UserRepresentation getUser() {
        return user;
    }

    public void setUser(UserRepresentation user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
