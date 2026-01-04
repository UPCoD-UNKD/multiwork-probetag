package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.CreateProjectApplicationDTO;
import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.ProjectApplication;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.enums.ApplicationStatus;
import com.multiworkbackend.exceptions.AlreadyExistException;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectApplicationMapper;
import com.multiworkbackend.repo.ProjectApplicationRepository;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.ProjectApplicationCommandService;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.ProjectTeamService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.dto.UserDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Implementation of ProjectApplicationCommandService for application write operations.
 * Follows CQRS pattern and best practices for command services.
 */
@Service
@RequiredArgsConstructor
public class ProjectApplicationCommandServiceImpl implements ProjectApplicationCommandService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectApplicationCommandServiceImpl.class);

    private final ProjectApplicationRepository applicationRepository;
    private final ProjectApplicationMapper applicationMapper;
    private final ProjectRepository projectRepository;
    private final UserEntityService userEntityService;
    private final ProjectAuthorizationService projectAuthorizationService;
    private final ProjectTeamService projectTeamService;

    @Override
    @Transactional
    public ProjectApplicationDTO create(CreateProjectApplicationDTO createDTO, Authentication auth) 
            throws NoSuchElementFoundException, AlreadyExistException {
        
        Project project = projectRepository.findById(createDTO.getProjectId())
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + createDTO.getProjectId()));
        
        User applicant = userEntityService.getUserByUsername(auth.getName());
        
        // Check if user is already a member
        if (project.getMembers() != null && project.getMembers().stream()
                .anyMatch(member -> member.getId().equals(applicant.getId()))) {
            throw new IllegalArgumentException("User is already a member of this project");
        }
        
        // Check if user is the creator
        if (project.getCreator() != null && project.getCreator().getId().equals(applicant.getId())) {
            throw new IllegalArgumentException("Project creator cannot apply to their own project");
        }
        
        // Check if application already exists
        if (applicationRepository.existsByProjectIdAndApplicantId(createDTO.getProjectId(), applicant.getId())) {
            throw new AlreadyExistException("Application already exists for this project");
        }
        
        ProjectApplication application = ProjectApplication.builder()
                .project(project)
                .applicant(applicant)
                .status(ApplicationStatus.PENDING)
                .message(createDTO.getMessage())
                .createdAt(LocalDateTime.now())
                .build();
        
        ProjectApplication savedApplication = applicationRepository.save(application);
        logger.info("Application created successfully with ID: {} for project {} by user {}", 
                savedApplication.getId(), createDTO.getProjectId(), auth.getName());
        
        return applicationMapper.toDTO(savedApplication);
    }

    @Override
    @Transactional
    public ProjectApplicationDTO approve(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementFoundException("Application not found with id: " + applicationId));
        
        // Only project creator can approve
        projectAuthorizationService.requireOwner(application.getProject().getId(), auth);
        
        // Check if application is in PENDING status
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Only pending applications can be approved");
        }
        
        // Add applicant to project team
        UserDTO userDTO = UserDTO.builder()
                .id(application.getApplicant().getId())
                .build();
        
        try {
            projectTeamService.addTeamMember(application.getProject().getId(), userDTO, auth);
        } catch (Exception e) {
            logger.error("Failed to add user to project team: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to add user to project team: " + e.getMessage());
        }
        
        // Update application status
        User reviewer = userEntityService.getUserByUsername(auth.getName());
        application.setStatus(ApplicationStatus.APPROVED);
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(reviewer);
        
        ProjectApplication savedApplication = applicationRepository.save(application);
        logger.info("Application {} approved successfully by user {}", applicationId, auth.getName());
        
        return applicationMapper.toDTO(savedApplication);
    }

    @Override
    @Transactional
    public ProjectApplicationDTO reject(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementFoundException("Application not found with id: " + applicationId));
        
        // Only project creator can reject
        projectAuthorizationService.requireOwner(application.getProject().getId(), auth);
        
        // Check if application is in PENDING status
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Only pending applications can be rejected");
        }
        
        // Update application status
        User reviewer = userEntityService.getUserByUsername(auth.getName());
        application.setStatus(ApplicationStatus.REJECTED);
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(reviewer);
        
        ProjectApplication savedApplication = applicationRepository.save(application);
        logger.info("Application {} rejected successfully by user {}", applicationId, auth.getName());
        
        return applicationMapper.toDTO(savedApplication);
    }

    @Override
    @Transactional
    public ProjectApplicationDTO cancel(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementFoundException("Application not found with id: " + applicationId));
        
        User user = userEntityService.getUserByUsername(auth.getName());
        
        // Only applicant can cancel
        if (!application.getApplicant().getId().equals(user.getId())) {
            throw new NoPermissionException("Only the applicant can cancel their application");
        }
        
        // Check if application is in PENDING status
        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Only pending applications can be cancelled");
        }
        
        // Delete the application (soft delete by setting status, or hard delete)
        applicationRepository.delete(application);
        logger.info("Application {} cancelled successfully by user {}", applicationId, auth.getName());
        
        // Return DTO before deletion
        return applicationMapper.toDTO(application);
    }
}
