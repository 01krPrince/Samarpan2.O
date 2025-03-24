package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.model.Project;
import com.example.Samarpan2.O.model.createRequest.ProjectCreateRequest;
import com.example.Samarpan2.O.model.updateRequest.ProjectUpdateRequest;
import com.example.Samarpan2.O.repository.ProjectRepository;
import com.example.Samarpan2.O.service.ProjectService;
import com.example.Samarpan2.O.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    public ProjectRepository projectRepository;

    @Override
    public List<Project> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()) {
            throw new ResourceNotFoundException("No projects found");
        }
        return projects;
    }

    @Override
    public Project getProjectById(String projectId) {
        if (projectId == null) {
            throw new IllegalArgumentException("Project ID cannot be null");
        }

        Optional<Project> project = projectRepository.findById(projectId);
        if (project.isEmpty()) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }
        return project.get();
    }

    @Override
    public Project createProject(ProjectCreateRequest projectCreateRequest) {
        if (projectCreateRequest == null) {
            throw new IllegalArgumentException("Project create request cannot be null");
        }

        if (projectCreateRequest.getProjectName() == null || projectCreateRequest.getProjectName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be null or empty");
        }

        Optional<Project> existingProject = projectRepository.findByProjectName(projectCreateRequest.getProjectName());
        if (existingProject.isPresent()) {
            throw new IllegalArgumentException("A project with this name already exists");
        }

        Project project = new Project();
        project.setProjectName(projectCreateRequest.getProjectName());
        project.setBatch(projectCreateRequest.getBatch());
        project.setStudent(projectCreateRequest.getStudent());
        project.setSubject(projectCreateRequest.getSubject());
        project.setDeployedLink(projectCreateRequest.getDeployedLink());
        project.setGithubLink(projectCreateRequest.getGithubLink());
        project.setImageUrls(projectCreateRequest.getImageUrls());

        try {
            return projectRepository.save(project);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create project: " + e.getMessage());
        }
    }

    @Override
    public Project updateProject(ProjectUpdateRequest projectUpdateRequest) {
        if (projectUpdateRequest == null) {
            throw new IllegalArgumentException("Project update request cannot be null");
        }

        if (projectUpdateRequest.getProjectId() == null || projectUpdateRequest.getProjectId().trim().isEmpty()) {
            throw new IllegalArgumentException("Project ID cannot be null or empty");
        }

        Project existingProject = getProjectById(projectUpdateRequest.getProjectId());

        if (projectUpdateRequest.getProjectName() != null && !projectUpdateRequest.getProjectName().trim().isEmpty()) {
            // Check if the new name conflicts with other projects
            Optional<Project> projectWithSameName = projectRepository.findByProjectName(projectUpdateRequest.getProjectName().trim());
            if (projectWithSameName.isPresent() && !projectWithSameName.get().getProjectId().equals(existingProject.getProjectId())) {
                throw new IllegalArgumentException("A project with this name already exists");
            }
            existingProject.setProjectName(projectUpdateRequest.getProjectName().trim());
        }

        if (projectUpdateRequest.getStudent() != null) {
            existingProject.setStudent(projectUpdateRequest.getStudent());
        }

        if (projectUpdateRequest.getGithubLink() != null && !projectUpdateRequest.getGithubLink().trim().isEmpty()) {
            existingProject.setGithubLink(projectUpdateRequest.getGithubLink().trim());
        }

        if (projectUpdateRequest.getDeployedLink() != null && !projectUpdateRequest.getDeployedLink().trim().isEmpty()) {
            existingProject.setDeployedLink(projectUpdateRequest.getDeployedLink().trim());
        }

        if (projectUpdateRequest.getImageUrls() != null && !projectUpdateRequest.getImageUrls().trim().isEmpty()) {
            existingProject.setImageUrls(projectUpdateRequest.getImageUrls().trim());
        }

        if (projectUpdateRequest.getBatch() != null && !projectUpdateRequest.getBatch().trim().isEmpty()) {
            existingProject.setBatch(projectUpdateRequest.getBatch().trim());
        }

        if (projectUpdateRequest.getSubject() != null && !projectUpdateRequest.getSubject().trim().isEmpty()) {
            existingProject.setSubject(projectUpdateRequest.getSubject().trim());
        }

        try {
            return projectRepository.save(existingProject);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update project: " + e.getMessage(), e);
        }
    }

    @Override
    public boolean deleteProject(String projectId) {
        if (projectId == null) {
            throw new IllegalArgumentException("Project ID cannot be null");
        }

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }

        try {
            projectRepository.deleteById(projectId);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete project: " + e.getMessage());
        }
    }
}
