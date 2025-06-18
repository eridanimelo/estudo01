package com.eridanimelo.application.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.eridanimelo.application.app.model.UserRoot;
import com.eridanimelo.application.app.model.util.dto.UserRootDTO;
import com.eridanimelo.application.app.repository.UserRootRepository;
import com.eridanimelo.application.app.service.UserRootService;

@Transactional(rollbackFor = { Exception.class })
@Service("userRootService")
public class UserRootServiceImpl extends AbstractServiceImpl<UserRoot, UserRootDTO, Long> implements UserRootService {

    @Autowired
    private UserRootRepository userRootRepository;

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public Long findIdBySubdomain(String subdomain) {
        return userRootRepository.findIdBySubdomain(subdomain);
    }
}
