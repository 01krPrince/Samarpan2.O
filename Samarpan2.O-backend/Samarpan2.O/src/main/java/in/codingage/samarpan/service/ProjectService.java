package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Project;
import in.codingage.samarpan.model.Remarks;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjectService {
    List<Project> getAllProjects();
    Project getProjectById(String projectId);
    Project createProject(ProjectCreateRequest projectCreateRequest, String remoteUser);
    Project updateProject(ProjectUpdateRequest projectUpdateRequest);
    boolean deleteProject(String projectId);

    Page<Project> getAllProjectsForStudent(String adminId, int page, int size);
    Page<Project> getProjectByStudentId(String studentId, int page, int size);
    Page<Project> getProjectsByBatchId(String batchId, String studentId, int page, int size);

    Optional<Project> reviewProject(Project project, Set<Remarks> remarks, String comment);


}
