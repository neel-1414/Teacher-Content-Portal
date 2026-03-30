package com.portal.teachercontentportal.repository;

import com.portal.teachercontentportal.model.Content;
import com.portal.teachercontentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content, Long>{
    List<Content> findUploadedBy(User user);
    List<Content> findAllByOrderByCreatedAtDesc();
}
