package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Project;
import in.codingage.samarpan.model.Remarks;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ProjectService {
    List<Project> getAllProjects();
    Project getProjectById(String projectId);
    Project createProject(ProjectCreateRequest projectCreateRequest, String remoteUser);
    Project updateProject( ProjectUpdateRequest projectUpdateRequest);
    boolean deleteProject(String projectId);

    List<Project> getAllProjectsForStudent(String adminId);

    List<Project> getProjectByStudentId(String studentId);

//    Optional<Project> reviewProject(Project project, Set<Remarks> remarks, String comment);
}
