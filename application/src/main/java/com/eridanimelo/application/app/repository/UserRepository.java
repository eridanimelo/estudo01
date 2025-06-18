package com.eridanimelo.application.app.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eridanimelo.application.app.model.User;

public interface UserRepository extends AbstractRepository<User, Long> {

    String ID_USER_BY_EMAIL = "SELECT u.id FROM User u WHERE u.email = :email";

    @Query(ID_USER_BY_EMAIL)
    Long findIdByEmail(@Param("email") String email);

    String ID_USER_BY_ID_KEYCLOAK = "SELECT u.id FROM User u WHERE u.idKeycloak = :idKeycloak";

    @Query(ID_USER_BY_ID_KEYCLOAK)
    Long findIdByIdKeycloak(@Param("idKeycloak") String idKeycloak);

}
