package com.portal.teachercontentportal.service;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.ContentRepository;
import com.portal.teachercontentportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    public ContentService(ContentRepository contentRepository, UserRepository userRepository)
    {
        this.contentRepository=contentRepository;
        this.userRepository=userRepository;
    }

    public Content uploadContent(String title, String fileUrl, String userId)
    {
        User user=userRepository.findByUserId(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        Content content=new Content();
        content.setTitle(title);
        content.setFileUrl(fileUrl);
        content.setCreatedAt(LocalDateTime.now());
        content.setUploadedBy(user);

        return contentRepository.save(content);
    }

    public List<Content> getAllContent() {
        return contentRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Content> getContentByUser(String userId) {

        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return contentRepository.findUploadedBy(user);
    }

    public void deleteContent(Long contentId, String userId)
    {
        Content content=contentRepository.findById(contentId)
                .orElseThrow(()-> new RuntimeException("Content not found"));

        if(!content.getUploadedBy().getUserId().equals(userId))
        {
            throw new RuntimeException("You are not allowed to delete this content");
        }
        contentRepository.delete(content);
    }
}
