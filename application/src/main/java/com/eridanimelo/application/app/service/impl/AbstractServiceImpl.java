package com.eridanimelo.application.app.service.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.eridanimelo.application.app.model.util.mapper.GenericMapper;
import com.eridanimelo.application.app.repository.AbstractRepository;
import com.eridanimelo.application.app.service.AbstractService;

import com.eridanimelo.application.app.service.util.PageableDTO;
import com.eridanimelo.application.config.MapperFactory;
import com.eridanimelo.application.config.exception.AppException;

public abstract class AbstractServiceImpl<T, DTO, ID extends Serializable> implements AbstractService<T, DTO, ID> {

    @Autowired
    private AbstractRepository<T, ID> repository;

    @Autowired
    private MapperFactory mapperFactory;

    // Método para obter o mapper genérico
    public GenericMapper<T, DTO> getMapper() {
        Type type = getClass().getGenericSuperclass();
        while (!(type instanceof ParameterizedType)) {
            type = ((Class<?>) type).getGenericSuperclass();
        }
        ParameterizedType parameterizedType = (ParameterizedType) type;

        // Obter os tipos genericos diretamente
        Class<T> entityClass = (Class<T>) parameterizedType.getActualTypeArguments()[0];
        Class<DTO> dtoClass = (Class<DTO>) parameterizedType.getActualTypeArguments()[1];

        return mapperFactory.getGenericMapper(entityClass, dtoClass);
    }

    @Override
    public DTO save(DTO object) {
        GenericMapper<T, DTO> mapper = getMapper();
        return mapper.toDTO(repository.save(mapper.toEntity(object)));
    }

    @Override
    public void saveEntity(T object) {
        repository.save(object);
    }

    @Override
    public DTO update(DTO object) {
        GenericMapper<T, DTO> mapper = getMapper();
        return mapper.toDTO(repository.save(mapper.toEntity(object)));
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public DTO findOne(ID id) {
        GenericMapper<T, DTO> mapper = getMapper();
        return mapper.toDTO(repository.findById(id).orElseThrow(() -> new AppException("Entity not found")));
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public T findOneEntity(ID id) {
        GenericMapper<T, DTO> mapper = getMapper();
        return repository.findById(id).orElseThrow(() -> new AppException("Entity not found"));
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public boolean exists(ID id) {
        return repository.existsById(id);
    }

    @Override
    public void delete(ID id) {
        repository.deleteById(id);
    }

    @Override
    public void delete(DTO object) {
        GenericMapper<T, DTO> mapper = getMapper();
        repository.delete(mapper.toEntity(object));
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<DTO> findAll() {
        GenericMapper<T, DTO> mapper = getMapper();
        return mapper.iterableDTO(repository.findAll());
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<DTO> saveList(Iterable<DTO> object) {
        GenericMapper<T, DTO> mapper = getMapper();
        return (List<DTO>) repository.saveAll(mapper.iterableEntity(object));
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public DTO convertDTO(T obj) {
        GenericMapper<T, DTO> mapper = getMapper();
        return Objects.isNull(obj) ? null : mapper.toDTO(obj);
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public T convertEntity(DTO dto) {
        GenericMapper<T, DTO> mapper = getMapper();
        return Objects.isNull(dto) ? null : mapper.toEntity(dto);
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<DTO> convertDTOs(List<T> obj) {
        GenericMapper<T, DTO> mapper = getMapper();
        return Objects.isNull(obj) ? null : mapper.listDTO(obj);
    }

    @Override
    public void verificarObjeto(Object... obj) {
        if (Arrays.asList(obj).stream().anyMatch(Objects::isNull))
            throw new AppException("ID não pode ser nulo");
    }

    private Sort getSort(String sortField, String sortOrder) {
        return Sort.by(Sort.Direction.fromString(sortOrder), sortField);
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public Page<DTO> getAllLazy(PageableDTO<DTO> pageableDTO) {
        GenericMapper<T, DTO> mapper = getMapper();

        Sort sort = getSort(pageableDTO.getSortField(), pageableDTO.getSortOrder());

        Pageable pageable = PageRequest.of(pageableDTO.getPage(), pageableDTO.getSize(), sort);

        Page<T> page = repository.findAll(pageable);

        List<DTO> dtos = mapper.listDTO(page.getContent());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }
}
