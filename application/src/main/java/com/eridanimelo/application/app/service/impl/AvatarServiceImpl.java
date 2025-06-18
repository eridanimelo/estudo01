package com.eridanimelo.application.app.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.eridanimelo.application.app.model.Avatar;
import com.eridanimelo.application.app.model.User;
import com.eridanimelo.application.app.model.util.dto.AvatarDTO;
import com.eridanimelo.application.app.repository.AvatarRepository;
import com.eridanimelo.application.app.service.AvatarService;
import com.eridanimelo.application.app.service.UserRootService;
import com.eridanimelo.application.app.service.UserService;
import com.eridanimelo.application.config.JwtUtil;
import com.eridanimelo.application.config.util.ImageUtil;

@Transactional(rollbackFor = { Exception.class })
@Service("avatarService")
public class AvatarServiceImpl extends AbstractServiceImpl<Avatar, AvatarDTO, Long> implements AvatarService {

    @Autowired
    private AvatarRepository repository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRootService userRootService;

    @Override
    public void saveAvatar(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided or file is empty");
        }

        if (file.getSize() > 2 * 1024 * 1024) { // Limitar tamanho a 2MB
            throw new IllegalArgumentException("File size exceeds the limit of 2MB");
        }

        try {
            // Recupera o ID do usuário logado
            Long userId = userService.idPorEmailESubdomain(JwtUtil.getEmailFromToken(), null);

            // Comprime a imagem
            byte[] compressedImage = ImageUtil.compressImage(file.getBytes());
            if (compressedImage == null || compressedImage.length == 0) {
                throw new RuntimeException("Failed to compress the image");
            }

            System.out.println("compressedImage type: " + (compressedImage instanceof byte[]));

            // Busca ou cria um novo Avatar
            Avatar avatar = repository.findByUserId(userId).orElse(new Avatar());
            avatar.setUpload(compressedImage);
            avatar.setTipo(file.getContentType());
            avatar.setUser(new User(userId)); // Certifique-se de que `User` aceita apenas o ID no construtor

            // Salva ou atualiza o avatar
            repository.save(avatar);

        } catch (IOException e) {
            throw new RuntimeException("Failed to process the uploaded file", e);
        }
    }

    @Override
    public AvatarDTO findAvatarByLoggedUserRoot() {

        Long userId = userService.idPorEmailESubdomain(JwtUtil.getEmailFromToken(), null);

        return repository.findAvatarDTOByUserId(userId);
    }

    @Override
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public List<AvatarDTO> findAvatarsByLoggedUserRoot() {
        try {
            Long idUserRoot = userRootService.findIdBySubdomain(JwtUtil.getSubdomainFromToken());
            List<Object[]> results = repository.findAvatarDataByUserRootId(idUserRoot);

            return results.stream().map(row -> new AvatarDTO(
                    ((Number) row[0]).longValue(), // Avatar ID
                    (byte[]) row[1], // Upload (LOB)
                    (String) row[2], // Tipo
                    ((Number) row[3]).longValue(), // User ID
                    (String) row[4] // Email
            )).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching avatars for logged user", e);
        }
    }

}
