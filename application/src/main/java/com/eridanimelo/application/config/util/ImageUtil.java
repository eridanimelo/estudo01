package com.eridanimelo.application.config.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;

public class ImageUtil {

    public static byte[] compressImage(byte[] imageData) throws IOException {
        // Lê a imagem original
        ByteArrayInputStream inputStream = new ByteArrayInputStream(imageData);
        BufferedImage originalImage = ImageIO.read(inputStream);

        // Redimensiona para 50x50 pixels
        BufferedImage resizedImage = new BufferedImage(50, 50, BufferedImage.TYPE_INT_RGB);
        resizedImage.getGraphics().drawImage(originalImage, 0, 0, 50, 50, null);

        // Configura o nível de compressão do JPEG
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageWriter writer = ImageIO.getImageWritersByFormatName("jpg").next();
        ImageOutputStream ios = ImageIO.createImageOutputStream(outputStream);
        writer.setOutput(ios);

        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(0.7f); // Qualidade entre 0.0 (mais comprimido) e 1.0 (menos comprimido)

        // Escreve a imagem comprimida
        writer.write(null, new IIOImage(resizedImage, null, null), param);

        // Libera recursos
        ios.close();
        writer.dispose();

        return outputStream.toByteArray();
    }
}
