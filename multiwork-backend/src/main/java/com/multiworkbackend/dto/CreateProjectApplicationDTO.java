package com.multiworkbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for creating a new project application.
 * Contains validation constraints for input validation.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateProjectApplicationDTO {
    
    @NotNull(message = "Project ID is required")
    private Long projectId;
    
    @Size(max = 1000, message = "Message cannot exceed 1000 characters")
    private String message; // Optional message from applicant
}
