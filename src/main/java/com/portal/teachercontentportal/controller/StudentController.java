package com.portal.teachercontentportal.controller;

import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.repository.ContentRepository;
import com.portal.teachercontentportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {
    private final UserRepository userRepository;
    private final ContentRepository contentRepository;
    private final FolderRepository folderRepository;

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String id = auth.getName();
    User student = userRepository.findByUserId(id).orElseThrow()(() -> new RuntimeException("Cannot find the user"));z
}
