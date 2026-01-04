package com.multiworkbackend.services;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.Authentication;

/**
 * Service interface for project team management operations.
 * Follows single responsibility principle.
 */
public interface ProjectTeamService {
    
    /**
     * Adds a team member to a project.
     *
     * @param projectId project ID
     * @param userDTO user to add as team member
     * @param auth authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException if user doesn't have permission
     * @throws NoSuchElementFoundException if project or user not found
     */
    ProjectDTO addTeamMember(Long projectId, UserDTO userDTO, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException;
    
    /**
     * Removes a team member from a project.
     *
     * @param projectId project ID
     * @param userId user ID to remove from team
     * @param auth authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException if user doesn't have permission
     * @throws NoSuchElementFoundException if project or user not found
     */
    ProjectDTO removeTeamMember(Long projectId, Long userId, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException;
}
