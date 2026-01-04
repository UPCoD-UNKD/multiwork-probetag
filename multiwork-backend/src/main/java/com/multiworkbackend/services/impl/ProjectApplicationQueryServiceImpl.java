package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.entity.ProjectApplication;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.enums.ApplicationStatus;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectApplicationMapper;
import com.multiworkbackend.repo.ProjectApplicationRepository;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.ProjectApplicationQueryService;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ProjectApplicationQueryService for read-only application operations.
 * Follows CQRS pattern and best practices for query services.
 */
@Service
@RequiredArgsConstructor
public class ProjectApplicationQueryServiceImpl implements ProjectApplicationQueryService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectApplicationQueryServiceImpl.class);

    private final ProjectApplicationRepository applicationRepository;
    private final ProjectApplicationMapper applicationMapper;
    private final ProjectRepository projectRepository;
    private final ProjectAuthorizationService projectAuthorizationService;
    private final UserEntityService userEntityService;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectApplicationDTO> findByProjectId(Long projectId, Pageable pageable, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        // Verify project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));
        
        // Only project creator can view applications
        projectAuthorizationService.requireOwner(projectId, auth);
        
        Page<ProjectApplication> applicationPage = applicationRepository.findByProjectId(projectId, pageable);
        return PageResponseUtil.toPageResponse(applicationPage, applicationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectApplicationDTO> findByProjectIdAndStatus(
            Long projectId, 
            ApplicationStatus status, 
            Pageable pageable, 
            Authentication auth
    ) throws NoSuchElementFoundException, NoPermissionException {
        
        // Verify project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));
        
        // Only project creator can view applications
        projectAuthorizationService.requireOwner(projectId, auth);
        
        Page<ProjectApplication> applicationPage = applicationRepository.findByProjectIdAndStatus(projectId, status, pageable);
        return PageResponseUtil.toPageResponse(applicationPage, applicationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectApplicationDTO> findByCurrentUser(Pageable pageable, Authentication auth) {
        User user = userEntityService.getUserByUsername(auth.getName());
        Page<ProjectApplication> applicationPage = applicationRepository.findByApplicantId(user.getId(), pageable);
        return PageResponseUtil.toPageResponse(applicationPage, applicationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectApplicationDTO> findByCurrentUserAndStatus(
            ApplicationStatus status, 
            Pageable pageable, 
            Authentication auth
    ) {
        User user = userEntityService.getUserByUsername(auth.getName());
        Page<ProjectApplication> applicationPage = applicationRepository.findByApplicantIdAndStatus(user.getId(), status, pageable);
        return PageResponseUtil.toPageResponse(applicationPage, applicationMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectApplicationDTO findById(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        ProjectApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new NoSuchElementFoundException("Application not found with id: " + applicationId));
        
        User user = userEntityService.getUserByUsername(auth.getName());
        
        // Check if user is the applicant or project creator
        boolean isApplicant = application.getApplicant().getId().equals(user.getId());
        boolean isCreator = application.getProject().getCreator() != null 
                && application.getProject().getCreator().getId().equals(user.getId());
        
        if (!isApplicant && !isCreator) {
            throw new NoPermissionException("You do not have permission to view this application");
        }
        
        return applicationMapper.toDTO(application);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPendingByProjectId(Long projectId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException {
        
        // Verify project exists
        projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));
        
        // Only project creator can view count
        projectAuthorizationService.requireOwner(projectId, auth);
        
        return applicationRepository.countPendingByProjectId(projectId);
    }
}
