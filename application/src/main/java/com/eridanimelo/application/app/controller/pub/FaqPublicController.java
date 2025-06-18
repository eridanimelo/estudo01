package com.eridanimelo.application.app.controller.pub;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eridanimelo.application.app.model.util.dto.FAQDTO;
import com.eridanimelo.application.app.service.FAQService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/public/faqs")
@Tag(name = "FAQs Publico", description = "FAQ Publico")
public class FaqPublicController {

    @Autowired
    private FAQService faqService;

    @Operation(summary = "List all FAQs", description = "Returns a list of all available FAQs.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ list returned successfully", content = @Content),
    })
    @GetMapping
    public ResponseEntity<List<FAQDTO>> getAllFAQs() {
        List<FAQDTO> faqList = faqService.findAll();
        return ResponseEntity.ok(faqList);
    }

}
