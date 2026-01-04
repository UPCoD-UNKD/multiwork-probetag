package com.multiworkbackend.mapper;

import com.multiworkbackend.dto.ProjectSummaryDTO;
import com.multiworkbackend.dto.UserSummaryDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import org.springframework.stereotype.Component;

/**
 * Utility class for common mapping operations.
 * Provides shared mapping methods to avoid code duplication.
 */
@Component
public class MapperUtils {

    /**
     * Converts User entity to UserSummaryDTO.
     * This method is shared across multiple mappers to avoid duplication.
     *
     * @param user the User entity
     * @return UserSummaryDTO
     */
    public UserSummaryDTO toUserSummaryDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserSummaryDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .build();
    }

    /**
     * Converts Project entity to ProjectSummaryDTO.
     * This method is shared across multiple mappers to avoid duplication.
     *
     * @param project the Project entity
     * @return ProjectSummaryDTO
     */
    public ProjectSummaryDTO toProjectSummaryDTO(Project project) {
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
}
