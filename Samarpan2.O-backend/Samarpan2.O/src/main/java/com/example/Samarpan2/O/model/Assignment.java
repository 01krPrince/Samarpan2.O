package com.example.Samarpan2.O.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assignment")
public class Assignment {
    @Id
    private Long id;

    private String title;
    private String description;
    private String batch;
    private String subject;
    private LocalDateTime deadline;
    private User admin;
    private List<Project> submittedProjects;
}
