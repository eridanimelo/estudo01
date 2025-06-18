package com.eridanimelo.application.config;

import com.eridanimelo.application.app.model.util.mapper.GenericMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

@Component
public class MapperFactory {

    @Autowired
    private ObjectMapper objectMapper;

    // Criação dinâmica do GenericMapper para qualquer tipo T e DTO
    public <T, DTO> GenericMapper<T, DTO> getGenericMapper(Class<T> entityClass, Class<DTO> dtoClass) {
        return new GenericMapper<>(objectMapper, entityClass, dtoClass);
    }
}
