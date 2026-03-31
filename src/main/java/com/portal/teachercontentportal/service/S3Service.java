package com.portal.teachercontentportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.UUID;

@Service
public class S3Service {
    private final S3Client s3Client;
    @Value("${aws_bucketname}")
    private String bucketName;

    public S3Service(S3Client s3Client)
    {
        this.s3Client = s3Client;
    }
    public String fileUpload(MultipartFile file)
    {
        String fileName = UUID.randomUUID() + " "+ file.getOriginalFilename();
        try {

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    putRequest,
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );
            return "https://" + bucketName + "s3.amazonaws.com/" + fileName;
        }
        catch(Exception e)
        {
            throw new RuntimeException("File upload failed "+ e.getMessage());
        }
    }
}
