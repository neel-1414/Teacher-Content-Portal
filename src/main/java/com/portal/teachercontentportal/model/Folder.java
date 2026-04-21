package com.portal.teachercontentportal.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="folders")
@Getter
@Setter

public class Folder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Year year;

    @Enumerated(EnumType.STRING)
    private Branch branch;

    private boolean enabled;

    @ManyToOne
    @JoinColumn(name="teacher_id", nullable = false)
    private User teacher;


}
