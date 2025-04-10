package in.codingage.samarpan.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "project")
public class Project {
    // STUDENT
    @Id
    private String projectId;
    private String studentId;
    private String studentName;
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private List<String> technologiesUsed;
    private String description;
    private String batch;
    private String batchId;
    private String subject;
    private String subjectId;
    private String branch;
    private String branchId;
    private LocalDateTime submissionDate = LocalDateTime.now();

    // ADMIN
    private Boolean markAsCheck = false;
    private Set<Remarks> remarks;
    private String comment;
}
