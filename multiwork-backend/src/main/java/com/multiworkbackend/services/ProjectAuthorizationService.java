package com.multiworkbackend.services;

import org.springframework.security.core.Authentication;

/**
 * Service for project authorization checks.
 * Centralizes all authorization logic to avoid code duplication.
 */
public interface ProjectAuthorizationService {
    
    /**
     * Checks if the user owns the project.
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return true if user owns the project
     */
    boolean isOwner(Long projectId, Authentication auth);
    
    /**
     * Checks if the user is the owner or a member of the project.
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return true if user is owner or member
     */
    boolean isOwnerOrMember(Long projectId, Authentication auth);
    
    /**
     * Checks if the user can edit the project (must be owner).
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return true if user can edit
     */
    boolean canEdit(Long projectId, Authentication auth);
    
    /**
     * Checks if the user can comment on the project (must be owner or member).
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return true if user can comment
     */
    boolean canComment(Long projectId, Authentication auth);
    
    /**
     * Requires that the user is the owner of the project.
     * Throws NoPermissionException if not.
     *
     * @param projectId project ID
     * @param auth authentication context
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user is not owner
     * @throws com.multiworkbackend.exceptions.NoSuchElementFoundException if project not found
     */
    void requireOwner(Long projectId, Authentication auth);
    
    /**
     * Requires that the user is the owner or a member of the project.
     * Throws NoPermissionException if not.
     *
     * @param projectId project ID
     * @param auth authentication context
     * @throws com.multiworkbackend.exceptions.NoPermissionException if user is not owner or member
     * @throws com.multiworkbackend.exceptions.NoSuchElementFoundException if project not found
     */
    void requireOwnerOrMember(Long projectId, Authentication auth);
}
