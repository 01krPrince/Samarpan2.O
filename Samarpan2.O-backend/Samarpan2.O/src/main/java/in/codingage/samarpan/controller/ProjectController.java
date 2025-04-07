package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Project;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import in.codingage.samarpan.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/all")
    public List<Project> getAllProjectsForStudent(HttpServletRequest request) {
        String remoteUser = request.getRemoteUser();
        return projectService.getAllProjectsForStudent(remoteUser);
    }

    @GetMapping("/getProjectById")
    public Project getProjectById(@RequestParam String projectId) {
        return projectService.getProjectById(projectId);
    }

    @PostMapping("/create")
    public Project createProject(@RequestBody ProjectCreateRequest projectCreateRequest, HttpServletRequest request) {
        String remoteUser = request.getRemoteUser();
        return projectService.createProject(projectCreateRequest, remoteUser);
    }

    @PutMapping("/update")
    public Project updateProject(  @RequestBody ProjectUpdateRequest projectUpdateRequest) {
        return projectService.updateProject( projectUpdateRequest);
    }

    @DeleteMapping("/delete")
    public String deleteProject(@RequestParam String projectId) {
        projectService.deleteProject(projectId);
        return "Project with ID " + projectId + " deleted successfully.";
    }

    @GetMapping("/getProjectByStudentId")
    public List<Project> getProjectByStudentId(@RequestParam String studentId){
        return projectService.getProjectByStudentId(studentId);
    }


}
