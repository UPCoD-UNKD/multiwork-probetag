package com.multiworkbackend.services;

import com.multiworkbackend.dto.ProjectDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

/**
 * Service interface for querying user-related projects.
 * Follows Interface Segregation Principle by separating project queries from user queries.
 */
public interface UserProjectQueryService {
    
    /**
     * Gets all projects of the current authenticated user.
     *
     * @param auth authentication context
     * @return list of ProjectDTO
     * @throws UsernameNotFoundException if user not found
     */
    List<ProjectDTO> getCurrentUserProjects(Authentication auth) throws UsernameNotFoundException;
}
