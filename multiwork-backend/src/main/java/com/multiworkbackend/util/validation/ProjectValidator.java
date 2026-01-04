package com.multiworkbackend.util.validation;

import com.multiworkbackend.dto.CreateProjectDTO;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.ProjectConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Validator for Project business rules.
 * Handles validation beyond DTO-level constraints.
 */
@Component
@RequiredArgsConstructor
public class ProjectValidator {
    
    private final DataSizeValidator dataSizeValidator;
    
    /**
     * Validates project creation data.
     *
     * @param dto project creation data
     * @throws IllegalArgumentException if validation fails
     */
    public void validateCreate(CreateProjectDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Project data cannot be null");
        }
        
        if (dto.getProjectName() == null || dto.getProjectName().trim().isEmpty()) {
            throw new IllegalArgumentException("Project name is required");
        }
        
        // Validate project name length
        dataSizeValidator.validateProjectNameLength(dto.getProjectName());
        
        // Validate description length
        if (dto.getDescription() != null) {
            dataSizeValidator.validateDescriptionLength(dto.getDescription(), "Description");
        }
        
        // Validate project photo size if present
        // Note: This is typically validated at DTO level, but we validate here for safety
    }
    
    /**
     * Validates project update data.
     *
     * @param dto project update data
     * @throws IllegalArgumentException if validation fails
     */
    public void validateUpdate(ProjectDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Project data cannot be null");
        }
        
        if (dto.getProjectName() != null) {
            if (dto.getProjectName().trim().isEmpty()) {
                throw new IllegalArgumentException("Project name cannot be empty");
            }
            // Validate project name length
            dataSizeValidator.validateProjectNameLength(dto.getProjectName());
        }
        
        // Validate description length
        if (dto.getDescription() != null) {
            dataSizeValidator.validateDescriptionLength(dto.getDescription(), "Description");
        }
        
        // Validate project photo size if present
        if (dto.getProjectPhoto() != null) {
            dataSizeValidator.validateProjectPhotoSize(dto.getProjectPhoto());
        }
    }
    
    /**
     * Validates that team size does not exceed maximum.
     *
     * @param project project to validate
     * @throws IllegalArgumentException if team size exceeds maximum
     */
    public void validateTeamSize(Project project) {
        if (project == null) {
            throw new IllegalArgumentException("Project cannot be null");
        }
        
        if (project.getMembers() != null && 
            project.getMembers().size() >= ProjectConstants.MAX_TEAM_MEMBERS) {
            throw new IllegalArgumentException(
                String.format("Maximum team size (%d) reached", 
                    ProjectConstants.MAX_TEAM_MEMBERS));
        }
    }
    
    /**
     * Validates that a user is not already a member of the project.
     *
     * @param project project to check
     * @param userId user ID to check
     * @throws IllegalArgumentException if user is already a member
     */
    public void validateUserNotAlreadyMember(Project project, Long userId) {
        if (project == null) {
            throw new IllegalArgumentException("Project cannot be null");
        }
        
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        
        // Check if user is the creator (creator is already in members set)
        if (project.getCreator() != null && project.getCreator().getId().equals(userId)) {
            throw new IllegalArgumentException("Project creator is already a member");
        }
        
        // Check if user is already a member
        if (project.getMembers() != null) {
            boolean isMember = project.getMembers().stream()
                .anyMatch(member -> member.getId().equals(userId));
            
            if (isMember) {
                throw new IllegalArgumentException("User is already a member of this project");
            }
        }
    }
}
