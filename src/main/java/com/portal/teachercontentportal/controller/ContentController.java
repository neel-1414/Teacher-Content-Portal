package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.service.ContentService;
import com.portal.teachercontentportal.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/content")
public class ContentController {

    private final ContentService contentService;
    private final S3Service s3Service;

    public ContentController(ContentService contentService, S3Service s3Service)
    {
        this.contentService = contentService;
        this.s3Service = s3Service;
    }

    // 1. Upload Content
    @PostMapping("/upload")
    public ResponseEntity<Content> uploadContent(
            @RequestParam String title,
            @RequestParam MultipartFile file
    ) {

        // Step 1: upload file to S3
        String fileUrl = s3Service.fileUpload(file);

        // ⚠️ TEMP (replace later with JWT) we will extract JWT here
        Long userId = 1L;

        // Step 2: save content in DB
        Content content = contentService.uploadContent(title, fileUrl, userId);
        return ResponseEntity.ok(content);
    }

    //2. Get All Content
    @GetMapping
    public ResponseEntity<List<Content>> getAllContent()
    {
        return ResponseEntity.ok(contentService.getAllContent());
    }

    //3. Get My Content
    @GetMapping("/my")
    public ResponseEntity<List<Content>> getMyContent() {

        // ⚠️ TEMP we will extract JWT here
        Long userId = 1L;

        return ResponseEntity.ok(contentService.getContentByUser(userId));
    }

    //4. Delete Content
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContent(@PathVariable Long id)
    {
        contentService.deleteContent(id);
        return ResponseEntity.ok("Content deleted successfully");
    }
}