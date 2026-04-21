package com.portal.teachercontentportal.repository;

import com.portal.teachercontentportal.model.Branch;
import com.portal.teachercontentportal.model.Folder;
import com.portal.teachercontentportal.model.User;
import com.portal.teachercontentportal.model.Year;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FolderRepository extends JpaRepository<Folder, Long> {
    List<Folder> findByTeacher(User teacher);
    List<Folder> findByYearAndBranchAndEnabledTrue(Year year, Branch branch);

    List<Folder> findByYearAndBranchAndEnabledTrue(Year year, Branch branch, boolean enabled, Sort sort, Limit limit);
}
