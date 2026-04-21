package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.ContentRepository;
import com.portal.teachercontentportal.repository.FolderRepository;
import com.portal.teachercontentportal.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/student")
public class StudentController {
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final FolderRepository folderRepository;

    public StudentController(UserRepository userRepository, ContentRepository contentRepository, FolderRepository folderRepository) {
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.folderRepository = folderRepository;
    }
    @GetMapping("/folders")
    public List<Folder> getFolders()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userID = auth.getName();
        User student = userRepository.findByUserId(userID).orElseThrow(()->new RuntimeException("User Not found"));
        return folderRepository.findByYearandBranchandEnabledTrue(student.getYear(),student.getBranch());
    }
    @GetMapping("/folders/{folder}")
    public List<Content> getFiles(@PathVariable Long folderId)
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userID = auth.getName();
        User student = userRepository.findByUserId(userID).orElseThrow(()->new RuntimeException("User Not found"));
        Folder folder = folderRepository.findById(folderId).orElseThrow(()->new RuntimeException("Folder not found"));

        if(student.getYear() != folder.getYear() || student.getBranch() != folder.getBranch() || !folder.isEnabled())
        {
            throw new RuntimeException("Access Denied");
        }
        return contentRepository.findByFolderId(folderId);
    }
}
