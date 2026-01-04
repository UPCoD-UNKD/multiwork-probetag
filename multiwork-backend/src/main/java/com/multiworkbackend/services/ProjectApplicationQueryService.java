package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.enums.ApplicationStatus;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

/**
 * Service interface for project application query operations (read-only).
 * Follows CQRS pattern separation of read and write operations.
 */
public interface ProjectApplicationQueryService {
    
    /**
     * Finds all applications for a project with pagination.
     * Only project creator can view applications.
     *
     * @param projectId project ID
     * @param pageable pagination parameters
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     * @throws NoSuchElementFoundException if project not found
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user is not project creator
     */
    PageResponse<ProjectApplicationDTO> findByProjectId(Long projectId, Pageable pageable, Authentication auth) 
            throws NoSuchElementFoundException, com.multiworkbackend.exceptions.NoPermissionException;
    
    /**
     * Finds all applications for a project by status with pagination.
     * Only project creator can view applications.
     *
     * @param projectId project ID
     * @param status application status
     * @param pageable pagination parameters
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     * @throws NoSuchElementFoundException if project not found
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user is not project creator
     */
    PageResponse<ProjectApplicationDTO> findByProjectIdAndStatus(
            Long projectId, 
            ApplicationStatus status, 
            Pageable pageable, 
            Authentication auth
    ) throws NoSuchElementFoundException, com.multiworkbackend.exceptions.NoPermissionException;
    
    /**
     * Finds all applications by current user (applicant) with pagination.
     *
     * @param pageable pagination parameters
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    PageResponse<ProjectApplicationDTO> findByCurrentUser(Pageable pageable, Authentication auth);
    
    /**
     * Finds all applications by current user with specific status.
     *
     * @param status application status
     * @param pageable pagination parameters
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    PageResponse<ProjectApplicationDTO> findByCurrentUserAndStatus(
            ApplicationStatus status, 
            Pageable pageable, 
            Authentication auth
    );
    
    /**
     * Finds a specific application by ID.
     * User must be either the applicant or the project creator.
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return ProjectApplicationDTO
     * @throws NoSuchElementFoundException if application not found
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user doesn't have permission
     */
    ProjectApplicationDTO findById(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, com.multiworkbackend.exceptions.NoPermissionException;
    
    /**
     * Counts pending applications for a project.
     * Only project creator can view this count.
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return count of pending applications
     * @throws NoSuchElementFoundException if project not found
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user is not project creator
     */
    long countPendingByProjectId(Long projectId, Authentication auth) 
            throws NoSuchElementFoundException, com.multiworkbackend.exceptions.NoPermissionException;
}
