package com.multiworkbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateProjectDTO implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    @NotEmpty
    @NotBlank
    private String projectName;
    
    private String description;
    
    private Integer preferredTeamSize; // Preferred team size for the project
}
