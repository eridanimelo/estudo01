package com.eridanimelo.application.app.model.util.mapper;

import java.util.List;

public interface AbstractMapper<T, DTO> {
    DTO toDTO(T entity);

    T toEntity(DTO dto);

    List<DTO> listDTO(List<T> entities);

    List<T> listEntity(List<DTO> dtos);

    Iterable<DTO> iterableDTO(Iterable<T> entities);

    Iterable<T> iterableEntity(Iterable<DTO> dtos);
}
