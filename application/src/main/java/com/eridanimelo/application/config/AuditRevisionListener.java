package com.eridanimelo.application.config;

import org.hibernate.envers.RevisionListener;
import org.springframework.stereotype.Component;

import com.eridanimelo.application.app.model.AuditRevisionEntity;

@Component
public class AuditRevisionListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {
        AuditRevisionEntity audit = (AuditRevisionEntity) revisionEntity;
        String username = JwtUtil.getEmailFromToken();
        audit.setUsername(username == null ? "APPLICATION" : username);
    }

}