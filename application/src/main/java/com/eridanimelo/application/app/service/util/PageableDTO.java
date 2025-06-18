package com.eridanimelo.application.app.service.util;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotNull;

public class PageableDTO<T> implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    @NotNull
    private Integer page;

    @NotNull
    private Integer size;

    @NotNull(message = "SOFRTFIEL NULL")
    private String sortField;

    @NotNull
    private String sortOrder;

    private T dto;

    // Getter and Setter for 'page'
    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    // Getter and Setter for 'size'
    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    // Getter and Setter for 'sortField'
    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    // Getter and Setter for 'sortOrder'
    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    // Getter and Setter for 'dto'
    public T getDto() {
        return dto;
    }

    public void setDto(T dto) {
        this.dto = dto;
    }
}
