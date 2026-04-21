package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.FolderRepository;
import com.portal.teachercontentportal.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/folders")
public class FolderController {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    public FolderController(FolderRepository folderRepository, UserRepository userRepository)
    {
        this.folderRepository=folderRepository;
        this.userRepository=userRepository;
    }

    @PostMapping("/upload")
    public Folder createFolder(@RequestBody Folder folder, Principal principal)
    {
        User teacher=userRepository.findByUserId(principal.getName())
                .orElseThrow(()-> new RuntimeException("User not found"));

        folder.setTeacher(teacher);

        return folderRepository.save(folder);
    }

    @GetMapping
    public List<Folder> getMyFolders(Principal principal)
    {
        User teacher=userRepository.findByUserId(principal.getName())
                .orElseThrow(()-> new RuntimeException("User not found"));
        return folderRepository.findByTeacher(teacher);
    }
}
