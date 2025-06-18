package com.eridanimelo.application.app.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.eridanimelo.application.app.model.UserRoot;

public interface UserRootRepository extends AbstractRepository<UserRoot, Long> {

    @Query("SELECT ur.id FROM UserRoot ur WHERE ur.subdomain = :subdomain")
    Long findIdBySubdomain(@Param("subdomain") String subdomain);

}
