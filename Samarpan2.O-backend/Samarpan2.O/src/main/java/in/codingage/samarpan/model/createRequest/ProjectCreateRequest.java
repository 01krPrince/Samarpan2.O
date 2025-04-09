package in.codingage.samarpan.model.createRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreateRequest {
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private String description;
    private String batch;
    private String batchId;
    private String subject;
    private String subjectId;
    private String branch;
    private String branchId;
}
