package com.example.Samarpan2.O.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project")
public class Project {
    @Id
    private Long id;

    private User student;
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private String batch;
    private String subject;
    private LocalDateTime submissionDate = LocalDateTime.now();
}
