package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Project;
import in.codingage.samarpan.model.Remarks;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import in.codingage.samarpan.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping("/all")
    public Page<Project> getAllProjectsForStudent(
            @RequestParam String adminId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return projectService.getAllProjectsForStudent(adminId, page, size);
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
    public Project updateProject(@RequestBody ProjectUpdateRequest projectUpdateRequest) {
        return projectService.updateProject(projectUpdateRequest);
    }

    @DeleteMapping("/delete")
    public String deleteProject(@RequestParam String projectId) {
        projectService.deleteProject(projectId);
        return "Project with ID " + projectId + " deleted successfully.";
    }

    @GetMapping("/getProjectByStudentId")
    public Page<Project> getProjectByStudentId(
            @RequestParam String studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return projectService.getProjectByStudentId(studentId, page, size);
    }

    @GetMapping("/getProjectByBatchId")
    public Page<Project> getProjectsByBatchId(
            @RequestParam String batchId,
            @RequestParam String studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return projectService.getProjectsByBatchId(batchId, studentId, page, size);
    }

    @PutMapping("/reviewProject")
    public Optional<Project> reviewProject(
            @RequestBody Project project,
            @RequestParam Set<Remarks> remarks,
            @RequestParam String comment
    ) {
        return projectService.reviewProject(project, remarks, comment);
    }
}
