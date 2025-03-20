package com.example.Samarpan2.O.controller;

import com.example.Samarpan2.O.model.Project;
import com.example.Samarpan2.O.model.createRequest.ProjectCreateRequest;
import com.example.Samarpan2.O.model.updateRequest.ProjectUpdateRequest;
import com.example.Samarpan2.O.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/getProjectById")
    public Project getProjectById(@RequestParam String projectId) {
        return projectService.getProjectById(projectId);
    }

    // Create a new project
    @PostMapping("/create")
    public Project createProject(@RequestBody ProjectCreateRequest projectCreateRequest) {
        return projectService.createProject(projectCreateRequest);
    }

    // Update an existing project
    @PutMapping("/update")
    public Project updateProject(  @RequestBody ProjectUpdateRequest projectUpdateRequest) {
        return projectService.updateProject( projectUpdateRequest);
    }

    // Delete a project by ID
    @DeleteMapping("/delete ")
    public String deleteProject(@RequestParam String projectId) {
        projectService.deleteProject(projectId);
        return "Project with ID " + projectId + " deleted successfully.";
    }


}
