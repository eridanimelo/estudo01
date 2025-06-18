package com.eridanimelo.application.app.service;

import java.util.List;

import com.eridanimelo.application.app.model.User;

import com.eridanimelo.application.app.model.util.dto.UserDTO;

public interface UserService extends AbstractService<User, UserDTO, Long> {

    List<User> findAllUsers();

    Long idPorEmailESubdomain(String email, String subdomain);

    Long idPorIdKeycloak(String idKeycloak);

}
