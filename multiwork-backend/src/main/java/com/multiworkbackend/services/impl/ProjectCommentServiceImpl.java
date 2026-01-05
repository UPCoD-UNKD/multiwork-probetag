package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.entity.Comment;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.CommentMapper;
import com.multiworkbackend.mapper.MapperUtils;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.CommentService;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.ProjectCommentService;
import com.multiworkbackend.services.UserEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of ProjectCommentService for project comment operations.
 * Follows single responsibility principle.
 */
@Service
@RequiredArgsConstructor
public class ProjectCommentServiceImpl implements ProjectCommentService {

    private final ProjectRepository projectRepository;
    private final CommentService commentService;
    private final UserEntityService userEntityService;
    private final CommentMapper commentMapper;
    private final ProjectAuthorizationService projectAuthorizationService;
    private final MapperUtils mapperUtils;

    @Override
    @Transactional
    @CacheEvict(value = "projects", key = "#projectId")
    public CommentDTO addComment(Long projectId, CommentDTO commentDTO, Authentication auth)
            throws NoPermissionException, NoSuchElementFoundException {

        projectAuthorizationService.requireOwnerOrMember(projectId, auth);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + projectId));

        if (commentDTO.getCreator() == null) {
            User creatorUser = userEntityService.getUserByUsername(auth.getName());
            commentDTO.setCreator(mapperUtils.toUserSummaryDTO(creatorUser));
        }

        Comment savedComment = commentService.createCommentEntity(commentDTO);
        project.addComment(savedComment);
        projectRepository.save(project);

        return commentMapper.toDTO(savedComment);
    }
}
