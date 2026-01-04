package com.multiworkbackend.dto;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.entity.SocialMedia;
import com.multiworkbackend.enums.ProjectStatus;
import com.multiworkbackend.enums.ProjectType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

/**
 * Data Transfer Object for Project entity.
 * Uses SummaryDTOs for nested objects to avoid lazy initialization issues and circular dependencies.
 * Conversion should be done through ProjectMapper.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectDTO {
    private Long id;
    private String projectName;
    private Long position;
    private Integer budget;
    private Integer preferredTeamSize;
    private LocalDate date;
    private UserSummaryDTO creator;
    private Set<UserSummaryDTO> members;
    private Set<UserSummaryDTO> followers;
    private Set<Skill> skills;
    private byte[] projectPhoto;
    private String description;
    private Set<SocialMedia> socialMediaSet;
    private Set<CommentDTO> comments;
    private Set<ProjectStatus> projectStatuses;
    private Set<ProjectType> projectTypes;
}
