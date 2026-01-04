package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.AlreadyExistException;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectMapper;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.ProjectTeamService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.util.validation.ProjectValidator;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ProjectTeamService for project team management.
 * Follows single responsibility principle.
 */
@Service
@RequiredArgsConstructor
public class ProjectTeamServiceImpl implements ProjectTeamService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final UserEntityService userEntityService;
    private final ProjectAuthorizationService projectAuthorizationService;
    private final ProjectValidator projectValidator;

    /**
     * Adds a team member to a project.
     * Validates that the user is not already a member and that team size limits are respected.
     *
     * @param projectId project ID
     * @param userDTO user to add
     * @param auth authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException if user is not the project owner
     * @throws NoSuchElementFoundException if project or user not found
     * @throws AlreadyExistException if user is already a member
     * @throws IllegalArgumentException if team size limit is reached
     */
    @Override
    @Transactional
    public ProjectDTO addTeamMember(Long projectId, UserDTO userDTO, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException {
        
        projectAuthorizationService.requireOwner(projectId, auth);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("No such project exists"));
        
        User userMember = userEntityService.getUserById(userDTO.getId());
        
        projectValidator.validateUserNotAlreadyMember(project, userMember.getId());
        projectValidator.validateTeamSize(project);
        
        project.addMember(userMember);
        
        Project savedProject = projectRepository.save(project);
        Project fullProject = projectRepository.findById(savedProject.getId())
                .orElse(savedProject);
        initializeElementCollections(fullProject);
        return projectMapper.toDTO(fullProject);
    }
    
    /**
     * Removes a team member from a project.
     * Validates that the user is the project owner and that the member exists.
     *
     * @param projectId project ID
     * @param userId user ID to remove
     * @param auth authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException if user is not the project owner
     * @throws NoSuchElementFoundException if project or user not found
     */
    @Override
    @Transactional
    public ProjectDTO removeTeamMember(Long projectId, Long userId, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException {
        
        projectAuthorizationService.requireOwner(projectId, auth);
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("No such project exists"));
        
        User userToRemove = userEntityService.getUserById(userId);
        
        // Check if user is a member
        if (project.getMembers() == null || !project.getMembers().contains(userToRemove)) {
            throw new NoSuchElementFoundException("User is not a member of this project");
        }
        
        // Remove member
        project.getMembers().remove(userToRemove);
        
        Project savedProject = projectRepository.save(project);
        Project fullProject = projectRepository.findById(savedProject.getId())
                .orElse(savedProject);
        initializeElementCollections(fullProject);
        return projectMapper.toDTO(fullProject);
    }
    
    private void initializeElementCollections(Project project) {
        if (project.getProjectStatuses() != null) {
            Hibernate.initialize(project.getProjectStatuses());
        }
        if (project.getProjectTypes() != null) {
            Hibernate.initialize(project.getProjectTypes());
        }
    }
}
