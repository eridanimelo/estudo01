package com.eridanimelo.application.app.service.impl.lazy.impl;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.eridanimelo.application.app.service.impl.lazy.AbstractLazy;
import com.eridanimelo.application.app.service.util.PageableDTO;

public abstract class AbstractLazyImpl<T> implements AbstractLazy<T> {

    @Override
    public Pageable getPageable(PageableDTO<T> pageableDTO) {
        Sort sort = getSort(pageableDTO.getSortField(), pageableDTO.getSortOrder());
        return PageRequest.of(pageableDTO.getPage(), pageableDTO.getSize(), sort);
    }

    @Override
    public Sort getSort(String sortField, String sortOrder) {
        return Sort.by(Sort.Direction.fromString(sortOrder), sortField);
    }
}
