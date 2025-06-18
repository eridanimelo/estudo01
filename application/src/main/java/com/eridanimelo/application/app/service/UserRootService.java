package com.eridanimelo.application.app.service;

import com.eridanimelo.application.app.model.UserRoot;
import com.eridanimelo.application.app.model.util.dto.UserRootDTO;

public interface UserRootService extends AbstractService<UserRoot, UserRootDTO, Long> {

    Long findIdBySubdomain(String subdomain);

}
