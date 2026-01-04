package com.multiworkbackend.services;

import com.multiworkbackend.dto.CreateProjectDTO;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.Authentication;

/**
 * Service interface for project command operations (create, update).
 * Follows CQRS pattern separation of read and write operations.
 */
public interface ProjectCommandService {
    
    /**
     * Creates a new project.
     *
     * @param createProjectDTO project creation data
     * @param auth authentication context
     * @return created ProjectDTO
     */
    ProjectDTO create(CreateProjectDTO createProjectDTO, Authentication auth);
    
    /**
     * Updates an existing project.
     *
     * @param projectDTO project data to update
     * @param id project ID
     * @param auth authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException if user doesn't have permission
     * @throws NoSuchElementFoundException if project not found
     */
    ProjectDTO update(ProjectDTO projectDTO, Long id, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException;
    
    /**
     * Deletes a project.
     * Only the project owner can delete the project.
     *
     * @param id project ID
     * @param auth authentication context
     * @throws NoPermissionException if user doesn't have permission
     * @throws NoSuchElementFoundException if project not found
     */
    void delete(Long id, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException;
}
