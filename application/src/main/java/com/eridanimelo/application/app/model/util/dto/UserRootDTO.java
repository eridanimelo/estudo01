package com.eridanimelo.application.app.model.util.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.lang.Long;

public class UserRootDTO implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubdomain() {
        return subdomain;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public String getIdKeycloak() {
        return idKeycloak;
    }

    public void setIdKeycloak(String idKeycloak) {
        this.idKeycloak = idKeycloak;
    }

    private String email;

    private String subdomain;

    private String idKeycloak;

}
