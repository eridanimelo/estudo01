package com.eridanimelo.application.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eridanimelo.application.app.model.util.dto.AvatarDTO;
import com.eridanimelo.application.app.service.AvatarService;

@RestController
@RequestMapping("/api/avatar")
public class AvatarController {

    @Autowired
    private AvatarService avatarService;

    @PostMapping("/upload")
    public void uploadAvatar(@RequestParam("file") MultipartFile file) {
        avatarService.saveAvatar(file);
    }

    @GetMapping("/logged-user-list")
    public List<AvatarDTO> getAvatarsByLoggedUserRoot() {
        return avatarService.findAvatarsByLoggedUserRoot();
    }

    @GetMapping("/logged-user")
    public ResponseEntity<AvatarDTO> getAvatarByLoggedUserRoot() {
        return ResponseEntity.ok(avatarService.findAvatarByLoggedUserRoot());
    }

}