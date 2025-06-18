package com.eridanimelo.application.app.service.impl.lazy;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.eridanimelo.application.app.service.util.PageableDTO;

public interface AbstractLazy<T> {
    Pageable getPageable(PageableDTO<T> pageableDTO);

    Sort getSort(String sortField, String sortOrder);
}
