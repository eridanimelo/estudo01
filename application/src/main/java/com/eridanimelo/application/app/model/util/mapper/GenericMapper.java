package com.eridanimelo.application.app.model.util.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class GenericMapper<T, DTO> implements AbstractMapper<T, DTO> {

    private final ObjectMapper objectMapper;
    private final Class<T> entityClass;
    private final Class<DTO> dtoClass;

    public GenericMapper(ObjectMapper objectMapper, Class<T> entityClass, Class<DTO> dtoClass) {
        this.objectMapper = objectMapper;
        this.entityClass = entityClass;
        this.dtoClass = dtoClass;
    }

    public T toEntity(DTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("DTO não pode ser nulo");
        }
        return objectMapper.convertValue(dto, entityClass);
    }

    public DTO toDTO(T entity) {
        if (entity == null) {
            throw new IllegalArgumentException("Entidade não pode ser nula");
        }
        return objectMapper.convertValue(entity, dtoClass);
    }

    @Override
    public List<DTO> listDTO(List<T> entities) {
        return entities.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<T> listEntity(List<DTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<DTO> iterableDTO(Iterable<T> entities) {
        return StreamSupport.stream(entities.spliterator(), false)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<T> iterableEntity(Iterable<DTO> dtos) {
        return StreamSupport.stream(dtos.spliterator(), false)
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
