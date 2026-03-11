package com.portal.teachercontentportal.model;
import jakarta.persistence.*;
@Entity
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false,unique = true) // this value cannot be null and should be unique
    private String teacherId;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING) // added string enum type to role
    private Role role;


    public User(String name, String password,String teacherId,Role role)
    {
        this.name = name;
        this.password = password;
        this.teacherId = teacherId;
        this.role = role;
    }

    // Getter Setter func
    public Long getId()
    {
        return id;
    }
    public void setId(Long id)
    {
        this.id = id;
    }
    public String getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name = name;
    }
    public String getTeacherId()
    {
        return teacherId;
    }
    public void setTeacherId(String teacherId)
    {
        this.teacherId = teacherId;
    }
    public String getPassword()
    {
        return password;
    }
    public void setPassword(String password)
    {
        this.password = password;
    }
    public Role getRole()
    {
        return role;
    }
    public void setRole(Role role)
    {
        this.role = role;
    }
}
