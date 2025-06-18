package com.eridanimelo.application.app.controller;

import com.eridanimelo.application.app.service.FAQService;
import com.eridanimelo.application.app.service.util.PageableDTO;
import com.eridanimelo.application.app.model.util.dto.FAQDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@Tag(name = "FAQs", description = "FAQ Management")
public class FAQController {

    @Autowired
    private FAQService faqService;

    @Operation(summary = "Create a new FAQ", description = "Allows creating a new FAQ in the system. Only users with the ROLE_OWNER can access this endpoint.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "FAQ created successfully", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @PreAuthorize("hasRole('ROLE_OWNER')")
    @PostMapping
    public ResponseEntity<FAQDTO> createFAQ(@RequestBody FAQDTO faqDTO) {
        FAQDTO savedFAQ = faqService.save(faqDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/faqs/" + savedFAQ.getId())
                .body(savedFAQ);
    }

    @Operation(summary = "Update an existing FAQ", description = "Allows updating an existing FAQ in the system. Only users with the ROLE_OWNER can access this endpoint.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ updated successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "FAQ not found", content = @Content),
            @ApiResponse(responseCode = "403", description = "Access denied", content = @Content)
    })
    @PreAuthorize("hasRole('ROLE_OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<FAQDTO> updateFAQ(@PathVariable Long id, @RequestBody FAQDTO faqDTO) {
        FAQDTO updatedFAQ = faqService.save(faqDTO);
        return ResponseEntity.ok(updatedFAQ);
    }

    @Operation(summary = "List all FAQs", description = "Returns a list of all available FAQs.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ list returned successfully", content = @Content),
    })
    @GetMapping
    public ResponseEntity<List<FAQDTO>> getAllFAQs() {
        List<FAQDTO> faqList = faqService.findAll();
        return ResponseEntity.ok(faqList);
    }

    @Operation(summary = "List all FAQs Lazy", description = "Returns a lazy-loaded list of all available FAQs.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lazy-loaded FAQ list returned successfully", content = @Content),
    })
    @PostMapping("/lazy")
    public Page<FAQDTO> getAllFAQsLazy(@RequestBody PageableDTO<FAQDTO> pageableDTO) {
        return faqService.getAllLazy(pageableDTO);
    }

    @Operation(summary = "Find an FAQ by ID", description = "Returns the details of a specific FAQ by its ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ found successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "FAQ not found", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<FAQDTO> getFAQById(@PathVariable Long id) {
        FAQDTO faqDTO = faqService.findOne(id);
        return ResponseEntity.ok(faqDTO);
    }

    @Operation(summary = "Delete an FAQ", description = "Removes a specific FAQ by its ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "FAQ deleted successfully", content = @Content),
            @ApiResponse(responseCode = "404", description = "FAQ not found", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFAQ(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.ok().build();
    }
}
