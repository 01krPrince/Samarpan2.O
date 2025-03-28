package com.example.Samarpan2.O.model.createRequest;

import com.example.Samarpan2.O.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreateRequest {
    private User student;
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private String batch;
    private String subject;
}
