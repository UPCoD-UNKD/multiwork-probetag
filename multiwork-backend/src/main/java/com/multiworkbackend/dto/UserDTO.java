package com.multiworkbackend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.multiworkbackend.entity.Link;
import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.entity.SocialMedia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * Data Transfer Object for User entity.
 * Uses SummaryDTOs for nested objects to avoid lazy initialization issues and circular dependencies.
 * Conversion should be done through UserMapper.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserDTO {
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private String bio;
    private Set<Skill> skills;
    private Set<Link> links;
    private Set<SocialMedia> socialMediaSet;

    // These fields are read-only and should not be set during deserialization
    // to avoid Jackson circular reference errors
    // They will still be serialized in responses, but ignored when deserializing requests
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<ProjectSummaryDTO> followingToProjects;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<ProjectSummaryDTO> creatorProjects;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<ProjectSummaryDTO> memberProjects;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<UserSummaryDTO> collaborators;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<UserSummaryDTO> following;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Set<UserSummaryDTO> followers;
}
