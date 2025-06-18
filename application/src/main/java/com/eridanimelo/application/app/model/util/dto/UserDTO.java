package com.eridanimelo.application.app.model.util.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.lang.Long;

public class UserDTO implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String email;

    private String tel;

    private String idKeycloak;

    private UserRootDTO userRoot;

    public UserDTO() {

    }

    public UserDTO(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public UserRootDTO getUserRoot() {
        return userRoot;
    }

    public void setUserRoot(UserRootDTO userRoot) {
        this.userRoot = userRoot;
    }

    public String getIdKeycloak() {
        return idKeycloak;
    }

    public void setIdKeycloak(String idKeycloak) {
        this.idKeycloak = idKeycloak;
    }

}
