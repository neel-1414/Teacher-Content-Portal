package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.service.ContentService;
import com.portal.teachercontentportal.service.S3Service;
import org.antlr.v4.runtime.Token;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController {

    private final ContentService contentService;
    private final S3Service s3Service;
    Authentication auth= SecurityContextHolder.getContext().getAuthentication();
    public ContentController(ContentService contentService, S3Service s3Service)
    {
        this.contentService = contentService;
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public ResponseEntity<Content> uploadContent(
            @RequestParam String title,
            @RequestParam MultipartFile file
    ) {

        String fileUrl = s3Service.fileUpload(file);

        String userId = auth.getPrincipal().toString();
        Content content = contentService.uploadContent(title, fileUrl, userId);
        return ResponseEntity.ok(content);
    }

    @GetMapping
    public ResponseEntity<List<Content>> getAllContent()
    {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Content>> getMyContent() {

        String userId = auth.getPrincipal().toString() ;

        return ResponseEntity.ok(contentService.getContentByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContent(@PathVariable Long id)
    {
        contentService.deleteContent(id);
        return ResponseEntity.ok("Content deleted successfully");
    }
}