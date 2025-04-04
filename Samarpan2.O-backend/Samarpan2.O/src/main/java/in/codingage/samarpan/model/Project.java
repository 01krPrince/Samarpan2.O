package in.codingage.samarpan.model;

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
    private String projectId;
    private String studentId;
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private String batch;
    private String batchId;
    private String subject;
    private String subjectId;
    private LocalDateTime submissionDate = LocalDateTime.now();
}
