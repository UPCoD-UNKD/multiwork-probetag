package com.multiworkbackend.services.impl;

import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.UserEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ProjectAuthorizationService.
 * Centralizes all project authorization logic to avoid code duplication.
 */
@Service
@RequiredArgsConstructor
public class ProjectAuthorizationServiceImpl implements ProjectAuthorizationService {

    private final ProjectRepository projectRepository;
    private final UserEntityService userEntityService;

    @Override
    @Transactional(readOnly = true)
    public boolean isOwner(Long projectId, Authentication auth) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));
        User user = userEntityService.getUserByUsername(auth.getName());
        return project.getCreator() != null && project.getCreator().getId().equals(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isOwnerOrMember(Long projectId, Authentication auth) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));
        User user = userEntityService.getUserByUsername(auth.getName());
        Long userId = user.getId();
        
        // Check if user is the creator
        if (project.getCreator() != null && project.getCreator().getId().equals(userId)) {
            return true;
        }
        
        // Check if user is a member
        if (project.getMembers() != null) {
            return project.getMembers().stream()
                    .anyMatch(member -> member.getId().equals(userId));
        }
        
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canEdit(Long projectId, Authentication auth) {
        return isOwner(projectId, auth);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean canComment(Long projectId, Authentication auth) {
        return isOwnerOrMember(projectId, auth);
    }

    @Override
    @Transactional(readOnly = true)
    public void requireOwner(Long projectId, Authentication auth) {
        if (!isOwner(projectId, auth)) {
            throw new NoPermissionException("User is not the owner of that project");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void requireOwnerOrMember(Long projectId, Authentication auth) {
        if (!isOwnerOrMember(projectId, auth)) {
            throw new NoPermissionException("You do not have permission to perform this action");
        }
    }
}
