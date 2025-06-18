package com.eridanimelo.application.app.model;

import java.io.Serializable;

import org.hibernate.envers.AuditTable;
import org.hibernate.envers.Audited;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Audited
@Table(name = "users")
@AuditTable(value = "user_aud")
@SequenceGenerator(name = "seq_user", sequenceName = "seq_user", initialValue = 1, allocationSize = 1)
public class User implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_user")
    private Long id;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String tel;

    @Column(name = "id_keycloak")
    private String idKeycloak;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_root_id", foreignKey = @ForeignKey(name = "FK_USER_USER_ROOT"))
    private UserRoot userRoot;

    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    // Getter and Setter methods

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

    public UserRoot getUserRoot() {
        return userRoot;
    }

    public void setUserRoot(UserRoot userRoot) {
        this.userRoot = userRoot;
    }

    public String getIdKeycloak() {
        return idKeycloak;
    }

    public void setIdKeycloak(String idKeycloak) {
        this.idKeycloak = idKeycloak;
    }

}
