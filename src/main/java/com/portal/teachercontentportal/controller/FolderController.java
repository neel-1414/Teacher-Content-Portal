package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.ContentRepository;
import com.portal.teachercontentportal.repository.FolderRepository;
import com.portal.teachercontentportal.repository.UserRepository;
import com.portal.teachercontentportal.service.ContentService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/folders")
public class FolderController {
    private final FolderRepository folderRepository;
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final ContentService contentService;
    public FolderController(FolderRepository folderRepository, UserRepository userRepository,ContentRepository contentRepository, ContentService contentService)
    {
        this.contentRepository = contentRepository;
        this.folderRepository=folderRepository;
        this.userRepository=userRepository;
        this.contentService=contentService;
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

    @GetMapping("/files/{folderId}")
    public List<Content> getFilesInsideFolder(@PathVariable Long folderId,
                                              Principal principal) {

        User teacher = userRepository.findByUserId(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        if (!folder.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return contentRepository.findByFolder(folder);
    }

    @DeleteMapping("/{folderId}")
    public String deleteFolder(@PathVariable Long folderId, Principal principal)
    {
        User teacher=userRepository.findByUserId(principal.getName())
                .orElseThrow(()->new RuntimeException("User not found"));
        Folder folder=folderRepository.findByIdAndTeacher(folderId, teacher)
                .orElseThrow(()->new RuntimeException("Folder not found or unauthorized"));
        contentService.deleteContentByFolder(folderId);
        folderRepository.delete(folder);
        return "folder deleted successfully";
    }
}
