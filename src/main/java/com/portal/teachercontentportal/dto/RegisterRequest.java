package com.portal.teachercontentportal.dto;
import com.portal.teachercontentportal.model.Role;
public class RegisterRequest {
    private String userId;
    private String password;
    private Role role;

    public RegisterRequest()
    {
    }

    public String getUserId()
    {
        return userId;
    }
    public void setUserId(String userId)
    {
        this.userId=userId;
    }
    public String getPassword()
    {
        return password;
    }

    public Role getRole()
    {
        return role;
    }
    public void setPassword(String password)
    {
        this.password=password;
    }
    public void setRole(Role role)
    {
        this.role=role;
    }
}
