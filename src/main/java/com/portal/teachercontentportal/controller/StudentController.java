package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.dto.ContentResponse;
import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.ContentRepository;
import com.portal.teachercontentportal.repository.FolderRepository;
import com.portal.teachercontentportal.repository.UserRepository;
import com.portal.teachercontentportal.service.S3Service;
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
    private final S3Service s3Service;
    private final FolderRepository folderRepository;

    public StudentController(UserRepository userRepository, ContentRepository contentRepository, FolderRepository folderRepository,S3Service s3Service) {
        this.userRepository = userRepository;
        this.contentRepository = contentRepository;
        this.folderRepository = folderRepository;
        this.s3Service = s3Service;
    }
    @GetMapping("/folders")
    public List<Folder> getFolders()
    {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userID = auth.getName();
        User student = userRepository.findByUserId(userID).orElseThrow(()->new RuntimeException("User Not found"));
        return folderRepository.findByYearAndBranchAndEnabledTrue(student.getYear(),student.getBranch());
    }
    @GetMapping("/folders/{folderId}")
    public List<ContentResponse> getFiles(@PathVariable Long folderId) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String userID = auth.getName();

        User student = userRepository.findByUserId(userID)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() ->
                        new RuntimeException("Folder not found"));

        if (!student.getYear().equals(folder.getYear()) ||
                !student.getBranch().equals(folder.getBranch()) ||
                !folder.isEnabled()) {

            throw new RuntimeException("Access Denied");
        }

        List<Content> files =
                contentRepository.findByFolder(folder);

        return files.stream()
                .map(file -> new ContentResponse(
                        file.getId(),
                        file.getTitle(),
                        s3Service.generatePresignedUrl(
                                file.getFileUrl()
                        )
                ))
                .toList();
    }
}
