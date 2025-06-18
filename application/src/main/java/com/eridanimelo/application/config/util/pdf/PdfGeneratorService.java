package com.eridanimelo.application.config.util.pdf;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.Map;

@Service
public class PdfGeneratorService {

    private final TemplateEngine templateEngine;

    public PdfGeneratorService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public void generatePdf(String templateName, Map<String, Object> data, String outputFilePath) {
        try {
            // Renderizar o template Thymeleaf em HTML
            Context context = new Context();
            context.setVariables(data);
            String renderedHtml = templateEngine.process(templateName, context);

            // Configurar o Flying Saucer para gerar o PDF
            try (OutputStream outputStream = new FileOutputStream(outputFilePath)) {
                ITextRenderer renderer = new ITextRenderer();

                // Configurar o documento HTML para o renderer
                renderer.setDocumentFromString(renderedHtml);
                renderer.layout();
                renderer.createPDF(outputStream);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar o PDF", e);
        }
    }
}
