package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ApplicationException;
import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.*;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import in.codingage.samarpan.repository.*;
import in.codingage.samarpan.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    public ProjectRepository projectRepository;

    @Autowired
    private BatchServiceImpl batchService;

    @Autowired
    private SubjectServiceImpl subjectService;

    @Autowired
    private UserServiceImpl userService;

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
    public Project createProject(ProjectCreateRequest request, String remoteUser) {

        batchService.findById(request.getBatchId())
                .orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));

        subjectService.findById(request.getSubjectId())
                .orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));

        projectRepository.findByProjectName(request.getProjectName())
                .ifPresent(p -> {
                    throw new ApplicationException("PROJECT", "NAME_ALREADY_EXISTS");
                });

        User currentUser = userService.findByUsername(remoteUser)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        Project project = new Project();
        project.setProjectName(request.getProjectName());
        project.setBatch(request.getBatch());
        project.setBatchId(request.getBatchId());
        project.setStudentId(currentUser.getId());
        project.setStudentName(currentUser.getName());
        project.setSubject(request.getSubject());
        project.setSubjectId(request.getSubjectId());
        project.setDeployedLink(request.getDeployedLink());
        project.setGithubLink(request.getGithubLink());
        project.setImageUrls(request.getImageUrls());
        project.setSubmissionDate(LocalDateTime.now());
        project.setDescription(request.getDescription());
        project.setBranchId(request.getBranchId());
        project.setTechnologiesUsed(request.getTechnologiesUsed());

        // Set branch name
        batchService.findById(request.getBranchId())
                .ifPresent(branch -> project.setBranch(request.getBranch()));

        try {
            return projectRepository.save(project);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create project: " + e.getMessage(), e);
        }
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    @Override
    public Project updateProject(ProjectUpdateRequest projectUpdateRequest) {
        if (projectUpdateRequest == null) {
            throw new IllegalArgumentException("Project update request cannot be null");
        }

        System.out.println("Sub Id ----   "+projectUpdateRequest.getStudentId());

        if (projectUpdateRequest.getProjectId() == null || projectUpdateRequest.getProjectId().trim().isEmpty()) {
            throw new IllegalArgumentException("Project ID cannot be null or empty");
        }

        if (projectUpdateRequest.getSubjectId() == null || projectUpdateRequest.getSubjectId().trim().isEmpty()) {
            throw new IllegalArgumentException("Subject ID cannot be null or empty");
        } else {
            subjectService.findById(projectUpdateRequest.getSubjectId()).orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));
        }

        Project existingProject = getProjectById(projectUpdateRequest.getProjectId());

        if (!existingProject.getStudentId().equals(projectUpdateRequest.getStudentId())) {
            throw new ApplicationException("PROJECT", "STUDENT_ID_MISMATCH");
        }

        if (projectUpdateRequest.getProjectName() != null && !projectUpdateRequest.getProjectName().trim().isEmpty()) {
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

        if (projectUpdateRequest.getSubject() != null && !projectUpdateRequest.getSubject().trim().isEmpty()) {
            existingProject.setSubject(projectUpdateRequest.getSubject().trim());
        }

        if (projectUpdateRequest.getTechnologiesUsed() != null && !projectUpdateRequest.getTechnologiesUsed().isEmpty()) {
            List<String> cleanedTechList = projectUpdateRequest.getTechnologiesUsed().stream()
                    .filter(tech -> tech != null && !tech.trim().isEmpty())
                    .map(String::trim)
                    .collect(Collectors.toList());

            existingProject.setTechnologiesUsed(cleanedTechList);
        }

        if (projectUpdateRequest.getDescription() != null && !projectUpdateRequest.getDescription().trim().isEmpty()) {
            existingProject.setDescription(projectUpdateRequest.getDescription().trim());
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
    public Page<Project> getAllProjectsForStudent(String adminId, int page, int size) {
        Optional<User> userOptional = userService.findById(adminId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getRoles().contains("ADMIN")) {
                Pageable pageable = PageRequest.of(
                        page,
                        size,
                        Sort.by(Sort.Direction.DESC, "submissionDate")
                );
                return projectRepository.findAll(pageable);
            } else {
                throw new RuntimeException("Access Denied: Not an Admin user");
            }
        } else {
            throw new RuntimeException("User not found with ID: " + adminId);
        }
    }

    @Override
    public Page<Project> getProjectByStudentId(String studentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submissionDate"));
        return projectRepository.findByStudentId(studentId, pageable);
    }

    @Override
    public Optional<Project> reviewProject(Project project, Set<Remarks> remarks, String comment) {
        project.setMarkAsCheck(true);
        project.setRemarks(remarks);
        project.setComment(comment);
        return Optional.of(projectRepository.save(project));
    }

    @Override
    public Page<Project> getProjectsByBatchId(String batchId, String studentId, int page, int size) {
        User student = userService.findById(studentId)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        Batch batch = batchService.findById(batchId)
                .orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submissionDate"));
        return projectRepository.findByBatchId(batchId, pageable);
    }
}