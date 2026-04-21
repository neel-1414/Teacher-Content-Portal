package com.portal.teachercontentportal.repository;

import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByTeacher(User teacher);
}
