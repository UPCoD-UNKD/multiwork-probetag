package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectMapper;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.services.ProjectQueryService;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.util.PageResponseUtil;
import com.multiworkbackend.util.ProjectConstants;
import com.multiworkbackend.util.ProjectSimilarityCalculator;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implementation of ProjectQueryService for read-only project operations.
 * Follows CQRS pattern and best practices for query services.
 */
@Service
@RequiredArgsConstructor
public class ProjectQueryServiceImpl implements ProjectQueryService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final SkillService skillService;
    private final ProjectSimilarityCalculator similarityCalculator;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectDTO> findAll(Pageable pageable) {
        Page<Project> projectPage = projectRepository.findAllWithDetails(pageable);
        projectPage.getContent().forEach(this::initializeElementCollections);
        return PageResponseUtil.toPageResponse(projectPage, projectMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = "projects", key = "#id", unless = "#result == null")
    public ProjectDTO findById(Long id) throws NoSuchElementFoundException {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + id));
        initializeElementCollections(project);
        
        ProjectDTO dto = projectMapper.toDTO(project);
        
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectDTO> findBySkill(Long skillId, Pageable pageable) throws NoSuchElementFoundException {
        skillService.findById(skillId);
        
        Page<Project> projectPage = projectRepository.findAllBySkillId(skillId, pageable);
        
        if (projectPage.isEmpty()) {
            throw new NoSuchElementFoundException("No projects found with skill id: " + skillId);
        }
        
        projectPage.getContent().forEach(this::initializeElementCollections);
        return PageResponseUtil.toPageResponse(projectPage, projectMapper::toDTO);
    }

    /**
     * Finds projects similar to the given projects based on skills.
     * Uses optimized query to fetch projects with common skills, then calculates
     * similarity scores and sorts them.
     *
     * @param projectIDs array of project IDs to find similar projects for
     * @param pageable pagination parameters
     * @return PageResponse containing similar projects sorted by similarity
     */
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProjectDTO> findSimilarProjects(Long[] projectIDs, Pageable pageable) {
        if (projectIDs == null || projectIDs.length == 0) {
            return PageResponse.<ProjectDTO>builder()
                    .content(Collections.emptyList())
                    .page(pageable.getPageNumber())
                    .size(pageable.getPageSize())
                    .totalElements(0)
                    .totalPages(0)
                    .first(true)
                    .last(true)
                    .hasNext(false)
                    .hasPrevious(false)
                    .build();
        }
        
        List<Long> excludedIds = Arrays.asList(projectIDs);
        List<Long> targetIds = Arrays.asList(projectIDs);
        
        List<Project> targetProjects = projectRepository.findAllById(targetIds);
        Map<Long, Set<Long>> targetProjectSkills = similarityCalculator.extractProjectSkills(targetProjects);
        
        if (targetProjectSkills.isEmpty()) {
            return buildEmptyPageResponse(pageable);
        }
        
        int fetchSize = Math.min(
                Math.max(
                        pageable.getPageSize() * ProjectConstants.MAX_SIMILAR_PROJECTS_FETCH_MULTIPLIER,
                        ProjectConstants.MIN_SIMILAR_PROJECTS_FETCH_SIZE
                ),
                ProjectConstants.MAX_SIMILAR_PROJECTS_FETCH_SIZE
        );
        Pageable largePageable = PageRequest.of(0, fetchSize);
        
        Page<Project> projectsWithCommonSkills = projectRepository.findProjectsWithCommonSkills(
                excludedIds, 
                targetIds, 
                largePageable
        );
        
        projectsWithCommonSkills.getContent().forEach(this::initializeElementCollections);
        
        List<ProjectSimilarityCalculator.ProjectSimilarityResult> similarityResults = 
                similarityCalculator.calculateAndSortSimilarities(
                        projectsWithCommonSkills.getContent(),
                        targetProjectSkills
                );
        
        List<ProjectDTO> similarProjects = similarityResults.stream()
                .map(result -> projectMapper.toDTO(result.getProject()))
                .collect(Collectors.toList());

        return applyPagination(similarProjects, pageable);
    }
    
    /**
     * Applies pagination to a list of projects.
     *
     * @param projects list of projects to paginate
     * @param pageable pagination parameters
     * @return PageResponse with paginated content
     */
    private PageResponse<ProjectDTO> applyPagination(
            List<ProjectDTO> projects,
            Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), projects.size());
        List<ProjectDTO> paginatedContent = start < projects.size() 
                ? projects.subList(start, end) 
                : Collections.emptyList();

        int totalPages = (int) Math.ceil((double) projects.size() / pageable.getPageSize());
        
        return PageResponse.<ProjectDTO>builder()
                .content(paginatedContent)
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(projects.size())
                .totalPages(totalPages)
                .first(pageable.getPageNumber() == 0)
                .last(pageable.getPageNumber() >= totalPages - 1)
                .hasNext(pageable.getPageNumber() < totalPages - 1)
                .hasPrevious(pageable.getPageNumber() > 0)
                .build();
    }
    
    private void initializeElementCollections(Project project) {
        if (project.getProjectStatuses() != null) {
            Hibernate.initialize(project.getProjectStatuses());
        }
        if (project.getProjectTypes() != null) {
            Hibernate.initialize(project.getProjectTypes());
        }
    }
    
    private PageResponse<ProjectDTO> buildEmptyPageResponse(Pageable pageable) {
        return PageResponse.<ProjectDTO>builder()
                .content(Collections.emptyList())
                .page(pageable.getPageNumber())
                .size(pageable.getPageSize())
                .totalElements(0)
                .totalPages(0)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();
    }
}
