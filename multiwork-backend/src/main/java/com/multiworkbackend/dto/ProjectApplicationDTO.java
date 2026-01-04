package com.multiworkbackend.dto;

import com.multiworkbackend.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object for ProjectApplication entity.
 * Uses SummaryDTOs for nested objects to avoid lazy initialization issues and circular dependencies.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectApplicationDTO {
    private Long id;
    private ProjectSummaryDTO project;
    private UserSummaryDTO applicant;
    private ApplicationStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private UserSummaryDTO reviewedBy;
}
