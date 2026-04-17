package com.portal.teachercontentportal.dto;

import lombok.Getter;

@Getter
public class ContentResponse {
    private Long id;
    private String title;
    private String fileUrl;

    public ContentResponse(Long id, String title,String fileUrl)
    {
        this.id = id;
        this.title = title;
        this.fileUrl = fileUrl;
    }
}
