package com.multiworkbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Simplified Project DTO for nested use in UserDTO to avoid circular dependencies.
 * Contains only essential project information without nested users.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectSummaryDTO {
    private Long id;
    private String projectName;
    private String description;
    private LocalDate date;
    private Integer budget;
    private Integer preferredTeamSize; // Preferred team size for the project
    private byte[] projectPhoto; // Include photo for display in lists
}
