package in.codingage.samarpan.model.updateRequest;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdateRequest {
    @NotBlank
    private String projectId;
    private String studentId;
    private String projectName;
    private String githubLink;
    private String deployedLink;
    private String imageUrls;
    private List<String> technologiesUsed;
    private String description;
    private String subject;
    private String subjectId;
}
