package com.eridanimelo.application.app.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eridanimelo.application.app.model.FAQ;
import com.eridanimelo.application.app.model.util.dto.FAQDTO;
import com.eridanimelo.application.app.service.FAQService;

@Transactional(rollbackFor = { Exception.class })
@Service("FAQService")
public class FAQServiceImpl extends AbstractServiceImpl<FAQ, FAQDTO, Long> implements FAQService {
}
