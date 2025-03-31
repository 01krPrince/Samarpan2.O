package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Project;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    Project getProjectById(String projectId);
    Project createProject(ProjectCreateRequest projectCreateRequest);
    Project updateProject( ProjectUpdateRequest projectUpdateRequest);
    boolean deleteProject(String projectId);
}
