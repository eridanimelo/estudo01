package com.eridanimelo.application.app.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.eridanimelo.application.app.model.User;
import com.eridanimelo.application.app.model.util.dto.UserDTO;
import com.eridanimelo.application.app.repository.UserRepository;
import com.eridanimelo.application.app.service.UserService;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl extends AbstractServiceImpl<User, UserDTO, Long> implements UserService {

    private final UserRepository repository;

    public UserServiceImpl(UserRepository userRepository) {
        this.repository = userRepository;
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<User> findAllUsers() {
        return repository.findAll();
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public Long idPorEmailESubdomain(String email, String subdomain) {
        return repository.findIdByEmail(email);
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public Long idPorIdKeycloak(String idKeycloak) {
        return repository.findIdByIdKeycloak(idKeycloak);
    }

}
