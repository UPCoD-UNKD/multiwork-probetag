package com.multiworkbackend.mapper;

import com.multiworkbackend.dto.CreateProjectDTO;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserSummaryDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.MapperUtils;
import com.multiworkbackend.services.UserEntityService;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Project entity and ProjectDTO.
 * Follows best practices for separation of concerns and single responsibility.
 */
@Component
public class ProjectMapper {

    private final CommentMapper commentMapper;
    private final UserEntityService userEntityService;
    private final MapperUtils mapperUtils;

    public ProjectMapper(CommentMapper commentMapper, UserEntityService userEntityService, MapperUtils mapperUtils) {
        this.commentMapper = commentMapper;
        this.userEntityService = userEntityService;
        this.mapperUtils = mapperUtils;
    }

    /**
     * Converts Project entity to ProjectDTO.
     * Converts nested User entities to UserSummaryDTO to avoid lazy initialization issues.
     *
     * @param project the Project entity
     * @return ProjectDTO
     */
    public ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }

        // Convert nested Users to UserSummaryDTO to avoid lazy initialization
        UserSummaryDTO creator = project.getCreator() != null
                ? mapperUtils.toUserSummaryDTO(project.getCreator())
                : null;
        
        Set<UserSummaryDTO> members = project.getMembers() != null
                ? project.getMembers().stream()
                    .map(mapperUtils::toUserSummaryDTO)
                    .collect(Collectors.toSet())
                : new HashSet<>();
        
        Set<UserSummaryDTO> followers = project.getFollowers() != null
                ? project.getFollowers().stream()
                    .map(mapperUtils::toUserSummaryDTO)
                    .collect(Collectors.toSet())
                : new HashSet<>();

        ProjectDTO dto = ProjectDTO.builder()
                .id(project.getId())
                .projectName(project.getProjectName())
                .position(project.getPosition())
                .budget(project.getBudget())
                .preferredTeamSize(project.getPreferredTeamSize())
                .date(project.getDate())
                .creator(creator)
                .members(members)
                .followers(followers)
                .skills(project.getSkills())
                .projectPhoto(project.getProjectPhoto())
                .description(project.getDescription())
                .socialMediaSet(project.getSocialMediaSet())
                .projectStatuses(project.getProjectStatuses())
                .projectTypes(project.getProjectTypes())
                .build();

        // Convert Comment entities to CommentDTO
        if (project.getComments() != null) {
            Set<com.multiworkbackend.dto.CommentDTO> commentDTOs = project.getComments().stream()
                    .map(commentMapper::toDTO)
                    .collect(Collectors.toSet());
            dto.setComments(commentDTOs);
        } else {
            dto.setComments(new HashSet<>());
        }

        return dto;
    }

    /**
     * Converts ProjectDTO to Project entity.
     *
     * @param dto the ProjectDTO
     * @return Project entity
     */
    public Project toEntity(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }

        Set<com.multiworkbackend.entity.Comment> commentEntities = null;
        if (dto.getComments() != null) {
            commentEntities = dto.getComments().stream()
                    .map(commentMapper::toEntity)
                    .collect(Collectors.toSet());
        }

        // Load full User entities from database using UserEntityService
        // This ensures we have complete entities instead of just IDs
        User creatorEntity = null;
        if (dto.getCreator() != null && dto.getCreator().getId() != null) {
            try {
                creatorEntity = userEntityService.getUserById(dto.getCreator().getId());
            } catch (NoSuchElementFoundException e) {
                // If user not found, set to null (will be handled by validation in service layer)
                creatorEntity = null;
            }
        }
        
        Set<User> memberEntities = null;
        if (dto.getMembers() != null && !dto.getMembers().isEmpty()) {
            memberEntities = dto.getMembers().stream()
                    .filter(m -> m.getId() != null)
                    .map(m -> {
                        try {
                            return userEntityService.getUserById(m.getId());
                        } catch (NoSuchElementFoundException e) {
                            return null; // Skip invalid user IDs
                        }
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
        }
        
        Set<User> followerEntities = null;
        if (dto.getFollowers() != null && !dto.getFollowers().isEmpty()) {
            followerEntities = dto.getFollowers().stream()
                    .filter(f -> f.getId() != null)
                    .map(f -> {
                        try {
                            return userEntityService.getUserById(f.getId());
                        } catch (NoSuchElementFoundException e) {
                            return null; // Skip invalid user IDs
                        }
                    })
                    .filter(java.util.Objects::nonNull)
                    .collect(Collectors.toSet());
        }
        
        return Project.builder()
                .id(dto.getId())
                .projectName(dto.getProjectName())
                .position(dto.getPosition())
                .budget(dto.getBudget())
                .preferredTeamSize(dto.getPreferredTeamSize())
                .date(dto.getDate())
                .creator(creatorEntity)
                .members(memberEntities)
                .followers(followerEntities)
                .skills(dto.getSkills())
                .projectPhoto(dto.getProjectPhoto())
                .description(dto.getDescription())
                .socialMediaSet(dto.getSocialMediaSet())
                .comments(commentEntities)
                .projectStatuses(dto.getProjectStatuses())
                .projectTypes(dto.getProjectTypes())
                .build();
    }

    /**
     * Converts CreateProjectDTO to Project entity for new project creation.
     *
     * @param createDTO the CreateProjectDTO
     * @return Project entity (without ID, as it's a new entity)
     */
    public Project toEntityFromCreateDTO(CreateProjectDTO createDTO) {
        if (createDTO == null) {
            return null;
        }

        return Project.builder()
                .projectName(createDTO.getProjectName())
                .description(createDTO.getDescription())
                .preferredTeamSize(createDTO.getPreferredTeamSize())
                .build();
    }
}
