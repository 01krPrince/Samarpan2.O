package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ApplicationException;
import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.*;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import in.codingage.samarpan.repository.*;
import in.codingage.samarpan.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    public ProjectRepository projectRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchServiceImpl branchService;

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
    public Project createProject(ProjectCreateRequest projectCreateRequest, String remoteUser) {
        if (projectCreateRequest == null) {
            throw new IllegalArgumentException("Project create request cannot be null");
        }

        if (projectCreateRequest.getBatchId() == null || projectCreateRequest.getBatchId().trim().isEmpty()) {
            throw new IllegalArgumentException("BatchId ID cannot be null or empty");
        } else {
            batchRepository.findById(projectCreateRequest.getBatchId()).orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));
        }

        if (projectCreateRequest.getSubjectId() == null || projectCreateRequest.getSubjectId().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject ID cannot be null or empty");
        } else {
            subjectRepository.findById(projectCreateRequest.getSubjectId()).orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));

        }

        if (projectCreateRequest.getProjectName() == null || projectCreateRequest.getProjectName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be null or empty");
        }

        Optional<Project> existingProject = projectRepository.findByProjectName(projectCreateRequest.getProjectName());
        if (existingProject.isPresent()) {
            throw new IllegalArgumentException("A project with this name already exists");
        }

        if (projectCreateRequest.getBranchId() == null || projectCreateRequest.getBranchId().trim().isEmpty()) {
            throw new IllegalArgumentException("Branch ID cannot be null or empty");
        }

        System.out.println("Branch id "+projectCreateRequest.getBranchId());

        String studentId = userRepository.findByUsername(remoteUser).get().getId();
        String studentName = userRepository.findByUsername(remoteUser).get().getName();
        Project project = new Project();
        project.setProjectName(projectCreateRequest.getProjectName());
        project.setBatch(projectCreateRequest.getBatch());
        project.setBatchId(projectCreateRequest.getBatchId());
        project.setStudentId(studentId);
        project.setStudentName(studentName);
        project.setSubject(projectCreateRequest.getSubject());
        project.setSubjectId(projectCreateRequest.getSubjectId());
        project.setDeployedLink(projectCreateRequest.getDeployedLink());
        project.setGithubLink(projectCreateRequest.getGithubLink());
        project.setImageUrls(projectCreateRequest.getImageUrls());
        project.setSubmissionDate(LocalDateTime.now());
        project.setDescription(projectCreateRequest.getDescription());
        project.setBranchId(projectCreateRequest.getBranchId());

        Optional<Branch> b = branchService.findById(projectCreateRequest.getBranchId());
        if (b.isPresent()){
            project.setBranch(b.get().getBranchName());
        }

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

        if (projectUpdateRequest.getBatchId() == null || projectUpdateRequest.getBatchId().trim().isEmpty()) {
            throw new IllegalArgumentException("BatchId ID cannot be null or empty");
        } else {
            batchRepository.findById(projectUpdateRequest.getBatchId()).orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));
        }

        if (projectUpdateRequest.getSubjectId() == null || projectUpdateRequest.getSubjectId().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject ID cannot be null or empty");
        } else {
            subjectRepository.findById(projectUpdateRequest.getSubjectId()).orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));

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

    @Override
    public List<Project> getAllProjectsForStudent(String adminId) {
        Optional<User> userOptional = userRepository.findById(adminId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getRoles().contains("ADMIN")) {
                return projectRepository.findAll();
            } else {
                throw new RuntimeException("Access Denied: Not an Admin user");
            }
        } else {
            throw new RuntimeException("User not found with ID: " + adminId);
        }
    }

    @Override
    public List<Project> getProjectByStudentId(String studentId) {
        System.out.println(projectRepository.findAllByStudentId(studentId));
        return projectRepository.findAllByStudentId(studentId);
    }

//    @Override
//    public Optional<Project> reviewProject(Project project, Set<Remarks> remarks, String comment) {
//        project.setMarkAsCheck(true);
//        project.setRemarks(remarks);
//        project.setComment(comment);
//        return Optional.of(projectRepository.save(project));
//    }


}
