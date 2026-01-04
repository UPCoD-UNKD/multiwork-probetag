package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for project query operations (read-only).
 * Follows CQRS pattern separation of read and write operations.
 */
public interface ProjectQueryService {
    
    /**
     * Finds all projects with pagination.
     *
     * @param pageable pagination parameters
     * @return PageResponse containing paginated projects
     */
    PageResponse<ProjectDTO> findAll(Pageable pageable);
    
    /**
     * Finds a project by ID.
     *
     * @param id project ID
     * @return ProjectDTO
     * @throws NoSuchElementFoundException if project not found
     */
    ProjectDTO findById(Long id) throws NoSuchElementFoundException;
    
    /**
     * Finds projects by skill ID with pagination.
     *
     * @param skillId skill ID
     * @param pageable pagination parameters
     * @return PageResponse containing paginated projects
     * @throws NoSuchElementFoundException if skill not found
     */
    PageResponse<ProjectDTO> findBySkill(Long skillId, Pageable pageable) throws NoSuchElementFoundException;
    
    /**
     * Finds similar projects based on skills with pagination.
     *
     * @param projectIDs array of project IDs to find similar projects for
     * @param pageable pagination parameters
     * @return PageResponse containing paginated similar projects
     */
    PageResponse<ProjectDTO> findSimilarProjects(Long[] projectIDs, Pageable pageable);
}
