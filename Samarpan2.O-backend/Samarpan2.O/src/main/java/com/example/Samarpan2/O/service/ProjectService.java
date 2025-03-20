package com.example.Samarpan2.O.service;

import com.example.Samarpan2.O.model.Project;
import com.example.Samarpan2.O.model.createRequest.ProjectCreateRequest;
import com.example.Samarpan2.O.model.updateRequest.ProjectUpdateRequest;

import java.util.List;

public interface ProjectService {
    List<Project> getAllProjects();
    Project getProjectById(String projectId);
    Project createProject(ProjectCreateRequest projectCreateRequest);
    Project updateProject( ProjectUpdateRequest projectUpdateRequest);
    boolean deleteProject(String projectId);
}
