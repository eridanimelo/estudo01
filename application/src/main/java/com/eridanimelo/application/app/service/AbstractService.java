package com.eridanimelo.application.app.service;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.domain.Page;

import com.eridanimelo.application.app.service.util.PageableDTO;

public interface AbstractService<T, DTO, ID extends Serializable> {

    /**
     * 
     * @param object
     * @return
     */
    DTO save(DTO object);

    void saveEntity(T obj);

    DTO update(DTO object);

    /**
     * 
     * @param object
     * @return
     */
    Iterable<DTO> saveList(Iterable<DTO> object);

    /**
     * 
     * @param id
     * @return
     */
    DTO findOne(ID id);

    /**
     * 
     * @param id
     * @return
     */
    T findOneEntity(ID id);

    /**
     * 
     * @param id
     * @return
     */
    boolean exists(ID id);

    /**
     * 
     * @param id
     */
    void delete(ID id);

    /**
     * 
     * @param object
     */
    void delete(DTO object);

    /**
     * 
     * @return
     */
    List<DTO> findAll();

    /**
     * Converter dto para entidade
     * 
     * @param obj
     * @return
     */
    DTO convertDTO(T obj);

    /**
     * Converter entidade para DTO
     * 
     * @param dto
     * @return
     */
    T convertEntity(DTO dto);

    /**
     * Converter lista de entidades para lista de DTOs
     * 
     * @param obj
     * @return
     */
    List<DTO> convertDTOs(List<T> obj);

    /**
     * 
     * @param obj
     */
    void verificarObjeto(Object... obj);

    Page<DTO> getAllLazy(PageableDTO<DTO> pageableDTO);

}
