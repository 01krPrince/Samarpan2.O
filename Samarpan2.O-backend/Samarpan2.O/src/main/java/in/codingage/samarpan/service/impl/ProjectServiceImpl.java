package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ApplicationException;
import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.*;
import in.codingage.samarpan.model.createRequest.ProjectCreateRequest;
import in.codingage.samarpan.model.updateRequest.ProjectUpdateRequest;
import in.codingage.samarpan.repository.ProjectRepository;
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
    private ProjectRepository projectRepository;

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
        if (isNullOrEmpty(projectId)) {
            throw new ApplicationException("PROJECT", "ID_CANNOT_BE_NULL");
        }

        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));
    }

    @Override
    public Project createProject(ProjectCreateRequest request, String remoteUser) {

        // Batch existence validation
        batchService.findById(request.getBatchId())
                .orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));

        // Subject existence validation
        subjectService.findById(request.getSubjectId())
                .orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));

        // Project name uniqueness
        projectRepository.findByProjectName(request.getProjectName())
                .ifPresent(p -> {
                    throw new ApplicationException("PROJECT", "NAME_ALREADY_EXISTS");
                });

        // Current user validation
        User currentUser = userService.findByUsername(remoteUser)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        // Create project object
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

        // Set branch name if exists
        batchService.findById(request.getBranchId())
                .ifPresent(branch -> project.setBranch(request.getBranch()));

        try {
            return projectRepository.save(project);
        } catch (Exception e) {
            throw new ApplicationException("PROJECT", "SAVE_FAILED");
        }
    }

    @Override
    public Project updateProject(ProjectUpdateRequest request) {
        if (request == null) {
            throw new ApplicationException("PROJECT", "UPDATE_REQUEST_NULL");
        }

        if (isNullOrEmpty(request.getProjectId())) {
            throw new ApplicationException("PROJECT", "ID_CANNOT_BE_NULL");
        }

        if (isNullOrEmpty(request.getSubjectId())) {
            throw new ApplicationException("SUBJECT", "ID_CANNOT_BE_NULL");
        } else {
            subjectService.findById(request.getSubjectId())
                    .orElseThrow(() -> new ApplicationException("SUBJECT", "DOES_NOT_EXIST"));
        }

        Project existingProject = getProjectById(request.getProjectId());

        if (!existingProject.getStudentId().equals(request.getStudentId())) {
            throw new ApplicationException("PROJECT", "STUDENT_ID_MISMATCH");
        }

        if (!isNullOrEmpty(request.getProjectName())) {
            Optional<Project> existingSameName = projectRepository.findByProjectName(request.getProjectName().trim());
            if (existingSameName.isPresent() &&
                    !existingSameName.get().getProjectId().equals(existingProject.getProjectId())) {
                throw new ApplicationException("PROJECT", "NAME_ALREADY_EXISTS");
            }
            existingProject.setProjectName(request.getProjectName().trim());
        }

        if (!isNullOrEmpty(request.getGithubLink())) {
            existingProject.setGithubLink(request.getGithubLink().trim());
        }

        if (!isNullOrEmpty(request.getDeployedLink())) {
            existingProject.setDeployedLink(request.getDeployedLink().trim());
        }

        if (!isNullOrEmpty(request.getImageUrls())) {
            existingProject.setImageUrls(request.getImageUrls().trim());
        }

        if (!isNullOrEmpty(request.getSubject())) {
            existingProject.setSubject(request.getSubject().trim());
        }

        if (request.getTechnologiesUsed() != null && !request.getTechnologiesUsed().isEmpty()) {
            List<String> cleanedTechList = request.getTechnologiesUsed().stream()
                    .filter(tech -> tech != null && !tech.trim().isEmpty())
                    .map(String::trim)
                    .collect(Collectors.toList());
            existingProject.setTechnologiesUsed(cleanedTechList);
        }

        if (!isNullOrEmpty(request.getDescription())) {
            existingProject.setDescription(request.getDescription().trim());
        }

        try {
            return projectRepository.save(existingProject);
        } catch (Exception e) {
            throw new ApplicationException("PROJECT", "UPDATE_FAILED");
        }
    }

    @Override
    public boolean deleteProject(String projectId) {
        if (isNullOrEmpty(projectId)) {
            throw new ApplicationException("PROJECT", "ID_CANNOT_BE_NULL");
        }

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found with ID: " + projectId);
        }

        try {
            projectRepository.deleteById(projectId);
            return true;
        } catch (Exception e) {
            throw new ApplicationException("PROJECT", "DELETE_FAILED");
        }
    }

    @Override
    public Page<Project> getAllProjectsForStudent(String adminId, int page, int size) {
        User user = userService.findById(adminId)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        if (!user.getRoles().contains("ADMIN")) {
            throw new ApplicationException("ACCESS", "DENIED_NOT_ADMIN");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submissionDate"));
        return projectRepository.findAll(pageable);
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
        userService.findById(studentId)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        batchService.findById(batchId)
                .orElseThrow(() -> new ApplicationException("BATCH", "DOES_NOT_EXIST"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submissionDate"));
        return projectRepository.findByBatchId(batchId, pageable);
    }

    private boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
