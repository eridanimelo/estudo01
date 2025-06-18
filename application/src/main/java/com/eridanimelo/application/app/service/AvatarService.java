package com.eridanimelo.application.app.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.eridanimelo.application.app.model.Avatar;
import com.eridanimelo.application.app.model.util.dto.AvatarDTO;

public interface AvatarService extends AbstractService<Avatar, AvatarDTO, Long> {

    void saveAvatar(MultipartFile file);

    AvatarDTO findAvatarByLoggedUserRoot();

    List<AvatarDTO> findAvatarsByLoggedUserRoot();
}
