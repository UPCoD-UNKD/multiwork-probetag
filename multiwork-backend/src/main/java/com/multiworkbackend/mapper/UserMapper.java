package com.multiworkbackend.mapper;

import com.multiworkbackend.dto.ProjectSummaryDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.dto.UserSummaryDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.mapper.MapperUtils;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Mapper for converting between User entity and UserDTO.
 * Follows best practices for separation of concerns and single responsibility.
 */
@Component
public class UserMapper {

    private final MapperUtils mapperUtils;

    public UserMapper(MapperUtils mapperUtils) {
        this.mapperUtils = mapperUtils;
    }

    /**
     * Converts User entity to UserDTO.
     * Converts nested Project entities to ProjectSummaryDTO to avoid lazy initialization issues.
     *
     * @param user the User entity
     * @return UserDTO
     */
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .skills(user.getSkills())
                .links(user.getLinks())
                .socialMediaSet(user.getSocialMediaSet())
                .followingToProjects(convertProjectsToSummary(user.getFollowingToProjects()))
                .creatorProjects(convertProjectsToSummary(user.getCreatorProjects()))
                .memberProjects(convertProjectsToSummary(user.getMemberProjects()))
                .collaborators(convertUsersToSummary(user.getCollaborators()))
                .following(convertUsersToSummary(user.getFollowing()))
                .followers(convertUsersToSummary(user.getFollowers()))
                .build();
    }
    
    /**
     * Converts a set of Project entities to ProjectSummaryDTO set.
     *
     * @param projects set of Project entities
     * @return set of ProjectSummaryDTO
     */
    private Set<ProjectSummaryDTO> convertProjectsToSummary(Set<Project> projects) {
        if (projects == null || projects.isEmpty()) {
            return new HashSet<>();
        }
        return projects.stream()
                .map(this::toProjectSummaryDTO)
                .collect(Collectors.toSet());
    }
    
    /**
     * Converts a set of User entities to UserSummaryDTO set.
     *
     * @param users set of User entities
     * @return set of UserSummaryDTO
     */
    private Set<UserSummaryDTO> convertUsersToSummary(Set<User> users) {
        if (users == null || users.isEmpty()) {
            return new HashSet<>();
        }
        return users.stream()
                .map(mapperUtils::toUserSummaryDTO)
                .collect(Collectors.toSet());
    }
    
    /**
     * Converts Project entity to ProjectSummaryDTO.
     */
    private ProjectSummaryDTO toProjectSummaryDTO(com.multiworkbackend.entity.Project project) {
        if (project == null) {
            return null;
        }
        return ProjectSummaryDTO.builder()
                .id(project.getId())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .date(project.getDate())
                .budget(project.getBudget())
                .preferredTeamSize(project.getPreferredTeamSize())
                .projectPhoto(project.getProjectPhoto())
                .build();
    }

    /**
     * Converts UserDTO to User entity.
     * Note: Password is not included in DTO for security reasons.
     *
     * @param dto the UserDTO
     * @return User entity
     */
    /**
     * Converts UserDTO to User entity.
     * Note: Password is not included in DTO for security reasons.
     * SummaryDTOs cannot be converted back to full entities - they should be loaded from database if needed.
     *
     * @param dto the UserDTO
     * @return User entity
     */
    public User toEntity(UserDTO dto) {
        if (dto == null) {
            return null;
        }

        // Note: SummaryDTOs cannot be converted back to full entities
        // This method should only be used when creating/updating users
        // where nested objects are not needed or should be loaded from database
        return User.builder()
                .id(dto.getId())
                .fullName(dto.getFullName())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .avatar(dto.getAvatar())
                .bio(dto.getBio())
                .skills(dto.getSkills())
                .links(dto.getLinks())
                .socialMediaSet(dto.getSocialMediaSet())
                // SummaryDTOs cannot be converted back - these should be loaded from DB if needed
                .build();
    }

    /**
     * Updates an existing User entity with data from UserDTO.
     * This method is used for partial updates and preserves fields not present in DTO.
     *
     * @param user the existing User entity to update
     * @param dto  the UserDTO with new data
     */
    public void updateEntityFromDTO(User user, UserDTO dto) {
        if (user == null || dto == null) {
            return;
        }

        if (dto.getFullName() != null) {
            user.setFullName(dto.getFullName());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio());
        }
        if (dto.getAvatar() != null) {
            user.setAvatar(dto.getAvatar());
        }
        if (dto.getSkills() != null) {
            user.setSkills(dto.getSkills());
        }
        if (dto.getLinks() != null) {
            user.setLinks(dto.getLinks());
        }
        if (dto.getSocialMediaSet() != null) {
            user.setSocialMediaSet(dto.getSocialMediaSet());
        }
    }
}
