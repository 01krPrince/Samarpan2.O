package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.model.Project;
import com.example.Samarpan2.O.model.createRequest.ProjectCreateRequest;
import com.example.Samarpan2.O.model.updateRequest.ProjectUpdateRequest;
import com.example.Samarpan2.O.repository.ProjectRepository;
import com.example.Samarpan2.O.service.ProjectService;
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
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(String projectId) {
       Optional<Project> project = projectRepository.findById(projectId);
       if (project.isPresent()){
          return  project.get();
       }
        throw new IllegalArgumentException("The project does not exists.");
    }
    @Override
    public Project createProject(ProjectCreateRequest projectCreateRequest) {
        Optional<Project> existingProject = projectRepository.findByProjectName(projectCreateRequest.getProjectName());
        if (existingProject.isPresent()) {
            throw new IllegalArgumentException("A project with this name already exists.");
        }
      Project project = new Project();
        project.setProjectName(projectCreateRequest.getProjectName());
        project.setBatch(projectCreateRequest.getBatch());
        project.setStudent(projectCreateRequest.getStudent());
        project.setSubject(projectCreateRequest.getSubject());
        project.setDeployedLink(projectCreateRequest.getDeployedLink());
        project.setGithubLink(projectCreateRequest.getGithubLink());
        project.setImageUrls(projectCreateRequest.getImageUrls());
        return projectRepository.save(project);
    }

    @Override
    public Project updateProject( ProjectUpdateRequest projectUpdateRequest) {

        Project existingProject = getProjectById(projectUpdateRequest.getProjectId());

        if (projectUpdateRequest.getProjectName() != null) {
            existingProject.setProjectName(projectUpdateRequest.getProjectName());
        }
        if (projectUpdateRequest.getGithubLink() != null) {
            existingProject.setGithubLink(projectUpdateRequest.getGithubLink());
        }
        if (projectUpdateRequest.getDeployedLink() != null) {
            existingProject.setDeployedLink(projectUpdateRequest.getDeployedLink());
        }
        if (projectUpdateRequest.getImageUrls() != null) {
            existingProject.setImageUrls(projectUpdateRequest.getImageUrls());
        }
        if (projectUpdateRequest.getBatch() != null) {
            existingProject.setBatch(projectUpdateRequest.getBatch());
        }
        if (projectUpdateRequest.getSubject() != null) {
            existingProject.setSubject(projectUpdateRequest.getSubject());
        }

        return projectRepository.save(existingProject);
    }



    @Override
    public boolean deleteProject(String projectId) {
         if (projectRepository.existsById(projectId)) {
             projectRepository.deleteById(projectId);
             return true;
         }else {
             throw new RuntimeException("Session not found with ID: " + projectId);
    }

}
}
