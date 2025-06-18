package com.eridanimelo.application.app.model.util.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.lang.Long;

public class AvatarDTO implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    private Long id;

    private byte[] upload;

    private String tipo;

    private UserDTO user;

    private Long userId;

    private String email;

    public AvatarDTO() {
    }

    public AvatarDTO(Long id, byte[] upload, String tipo, Long userId, String email) {
        this.id = id;
        this.upload = upload;
        this.tipo = tipo;
        this.userId = userId;
        this.email = email;
    }

    public AvatarDTO(Long id, byte[] upload, String tipo) {
        this.id = id;
        this.upload = upload;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getUpload() {
        return upload;
    }

    public void setUpload(byte[] upload) {
        this.upload = upload;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
