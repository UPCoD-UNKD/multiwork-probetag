package com.multiworkbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simplified User DTO for nested use in ProjectDTO to avoid circular dependencies.
 * Contains only essential user information without nested projects.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private String bio;
}
