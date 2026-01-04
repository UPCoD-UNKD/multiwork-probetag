package com.multiworkbackend.services;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.Authentication;

/**
 * Service interface for project comment operations.
 * Follows single responsibility principle.
 */
public interface ProjectCommentService {
    
    /**
     * Adds a comment to a project.
     *
     * @param projectId project ID
     * @param commentDTO comment data
     * @param auth authentication context
     * @return created CommentDTO
     * @throws NoPermissionException if user doesn't have permission
     * @throws NoSuchElementFoundException if project not found
     */
    CommentDTO addComment(Long projectId, CommentDTO commentDTO, Authentication auth) 
            throws NoPermissionException, NoSuchElementFoundException;
}
