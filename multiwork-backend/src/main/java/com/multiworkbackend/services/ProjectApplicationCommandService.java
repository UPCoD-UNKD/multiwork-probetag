package com.multiworkbackend.services;

import com.multiworkbackend.dto.CreateProjectApplicationDTO;
import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.Authentication;

/**
 * Service interface for project application command operations (create, update).
 * Follows CQRS pattern separation of read and write operations.
 */
public interface ProjectApplicationCommandService {
    
    /**
     * Creates a new project application.
     * Validates that user is not already a member and doesn't have a pending application.
     *
     * @param createDTO application creation data
     * @param auth authentication context
     * @return created ProjectApplicationDTO
     * @throws NoSuchElementFoundException if project not found
     * @throws com.multiworkbackend.exceptions.AlreadyExistException if application already exists
     * @throws IllegalArgumentException if user is already a member
     */
    ProjectApplicationDTO create(CreateProjectApplicationDTO createDTO, Authentication auth) 
            throws NoSuchElementFoundException, com.multiworkbackend.exceptions.AlreadyExistException;
    
    /**
     * Approves a project application.
     * Adds the applicant to the project team and updates application status.
     * Only project creator can approve applications.
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     * @throws NoSuchElementFoundException if application not found
     * @throws NoPermissionException if user is not project creator
     * @throws IllegalArgumentException if application is not in PENDING status
     */
    ProjectApplicationDTO approve(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException;
    
    /**
     * Rejects a project application.
     * Only project creator can reject applications.
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     * @throws NoSuchElementFoundException if application not found
     * @throws NoPermissionException if user is not project creator
     * @throws IllegalArgumentException if application is not in PENDING status
     */
    ProjectApplicationDTO reject(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException;
    
    /**
     * Cancels a project application.
     * Only the applicant can cancel their own application.
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     * @throws NoSuchElementFoundException if application not found
     * @throws NoPermissionException if user is not the applicant
     * @throws IllegalArgumentException if application is not in PENDING status
     */
    ProjectApplicationDTO cancel(Long applicationId, Authentication auth) 
            throws NoSuchElementFoundException, NoPermissionException;
}
