package com.multiworkbackend.mapper;

import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.dto.ProjectSummaryDTO;
import com.multiworkbackend.dto.UserSummaryDTO;
import com.multiworkbackend.entity.ProjectApplication;
import com.multiworkbackend.mapper.MapperUtils;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting between ProjectApplication entity and ProjectApplicationDTO.
 * Follows best practices for separation of concerns and single responsibility.
 */
@Component
public class ProjectApplicationMapper {

    private final MapperUtils mapperUtils;

    public ProjectApplicationMapper(MapperUtils mapperUtils) {
        this.mapperUtils = mapperUtils;
    }

    /**
     * Converts ProjectApplication entity to ProjectApplicationDTO.
     * Converts nested entities to SummaryDTOs to avoid lazy initialization issues.
     *
     * @param application the ProjectApplication entity
     * @return ProjectApplicationDTO
     */
    public ProjectApplicationDTO toDTO(ProjectApplication application) {
        if (application == null) {
            return null;
        }

        ProjectSummaryDTO project = application.getProject() != null
                ? mapperUtils.toProjectSummaryDTO(application.getProject())
                : null;

        UserSummaryDTO applicant = application.getApplicant() != null
                ? mapperUtils.toUserSummaryDTO(application.getApplicant())
                : null;

        UserSummaryDTO reviewedBy = application.getReviewedBy() != null
                ? mapperUtils.toUserSummaryDTO(application.getReviewedBy())
                : null;

        return ProjectApplicationDTO.builder()
                .id(application.getId())
                .project(project)
                .applicant(applicant)
                .status(application.getStatus())
                .message(application.getMessage())
                .createdAt(application.getCreatedAt())
                .reviewedAt(application.getReviewedAt())
                .reviewedBy(reviewedBy)
                .build();
    }
}
