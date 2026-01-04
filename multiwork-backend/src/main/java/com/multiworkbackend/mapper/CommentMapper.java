package com.multiworkbackend.mapper;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.entity.Comment;
import com.multiworkbackend.entity.User;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Comment entity and CommentDTO.
 * Follows best practices for separation of concerns and single responsibility.
 */
@Component
public class CommentMapper {

    private final MapperUtils mapperUtils;

    public CommentMapper(MapperUtils mapperUtils) {
        this.mapperUtils = mapperUtils;
    }

    /**
     * Converts Comment entity to CommentDTO.
     *
     * @param comment the Comment entity
     * @return CommentDTO
     */
    public CommentDTO toDTO(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentDTO dto = CommentDTO.builder()
                .id(comment.getId())
                .text(comment.getText())
                .date(comment.getDate())
                .time(comment.getTime())
                .build();

        // Convert creator User to UserSummaryDTO to avoid lazy initialization
        if (comment.getCreator() != null) {
            dto.setCreator(mapperUtils.toUserSummaryDTO(comment.getCreator()));
        }

        // Convert replies to CommentDTO recursively
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            Set<CommentDTO> replyDTOs = comment.getReplies().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toSet());
            dto.setReplies(replyDTOs);
        } else {
            dto.setReplies(new HashSet<>());
        }

        return dto;
    }

    /**
     * Converts CommentDTO to Comment entity.
     *
     * @param dto the CommentDTO
     * @return Comment entity
     */
    public Comment toEntity(CommentDTO dto) {
        if (dto == null) {
            return null;
        }

        // Note: When converting back to entity, we only have UserSummaryDTO
        // This means we can't fully reconstruct the User entity
        // In practice, this method should be used with caution
        // For creating new comments, the creator should be set from the authenticated user
        com.multiworkbackend.entity.User creatorEntity = null;
        if (dto.getCreator() != null && dto.getCreator().getId() != null) {
            // Create a minimal User entity with just the ID
            // The full user will be loaded from the database when needed
            creatorEntity = User.builder()
                    .id(dto.getCreator().getId())
                    .build();
        }

        Set<Comment> replyEntities = null;
        if (dto.getReplies() != null && !dto.getReplies().isEmpty()) {
            replyEntities = dto.getReplies().stream()
                    .map(this::toEntity)
                    .collect(Collectors.toSet());
        }

        return Comment.builder()
                .id(dto.getId())
                .creator(creatorEntity)
                .text(dto.getText())
                .date(dto.getDate())
                .time(dto.getTime())
                .replies(replyEntities)
                .build();
    }
}
