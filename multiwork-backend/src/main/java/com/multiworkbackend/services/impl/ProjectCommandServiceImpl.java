package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.CreateProjectDTO;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectMapper;
import com.multiworkbackend.repo.ProjectRepository;
import com.multiworkbackend.repo.ProjectApplicationRepository;
import com.multiworkbackend.repo.CommentRepo;
import com.multiworkbackend.services.ProjectAuthorizationService;
import com.multiworkbackend.services.ProjectCommandService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.util.ProjectConstants;
import com.multiworkbackend.util.ProjectFieldUpdater;
import com.multiworkbackend.util.validation.DataSizeValidator;
import com.multiworkbackend.util.validation.ProjectValidator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.hibernate.Hibernate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;

/**
 * Implementation of ProjectCommandService for project write operations.
 * Follows CQRS pattern and best practices for command services.
 */
@Service
@RequiredArgsConstructor
public class ProjectCommandServiceImpl implements ProjectCommandService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectCommandServiceImpl.class);

    private final ProjectRepository projectRepository;
    private final ProjectApplicationRepository projectApplicationRepository;
    private final CommentRepo commentRepository;
    private final ProjectMapper projectMapper;
    private final UserEntityService userEntityService;
    private final ProjectAuthorizationService projectAuthorizationService;
    private final ProjectValidator projectValidator;
    private final ProjectFieldUpdater projectFieldUpdater;
    private final DataSizeValidator dataSizeValidator;
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private org.springframework.cache.CacheManager cacheManager;

    /**
     * Creates a new project and associates it with the authenticated user as
     * creator.
     *
     * @param createProjectDTO project creation data
     * @param auth             authentication context
     * @return created ProjectDTO
     */
    @Override
    @Transactional
    public ProjectDTO create(CreateProjectDTO createProjectDTO, Authentication auth) {
        // Validate project creation data
        projectValidator.validateCreate(createProjectDTO);

        User creator = userEntityService.getUserByUsername(auth.getName());
        HashSet<User> members = new HashSet<>();
        members.add(creator);

        Project project = projectMapper.toEntityFromCreateDTO(createProjectDTO);
        project.setCreator(creator);
        project.setDate(LocalDate.now());
        Long maxPosition = projectRepository.getMaxPosition();
        project.setPosition(maxPosition + ProjectConstants.DEFAULT_POSITION_INCREMENT);
        project.setBudget(ProjectConstants.DEFAULT_BUDGET);
        project.setComments(new HashSet<>());
        project.setMembers(members);
        project.setFollowers(new HashSet<>());
        project.setSkills(new HashSet<>());
        project.setProjectTypes(new HashSet<>());
        project.setProjectStatuses(new HashSet<>());

        if (project.getProjectPhoto() != null) {
            dataSizeValidator.validateProjectPhotoSize(project.getProjectPhoto());
        }

        Project savedProject = projectRepository.save(project);
        logger.info("Project created successfully with ID: {} by user: {}",
                savedProject.getId(), auth.getName());

        Project fullProject = projectRepository.findById(savedProject.getId())
                .orElse(savedProject);
        initializeElementCollections(fullProject);
        ProjectDTO result = projectMapper.toDTO(fullProject);
        // Note: New projects don't need cache eviction, they're not cached yet
        return result;
    }

    /**
     * Updates an existing project.
     * Only updates fields that are provided in the DTO, preserving existing data.
     *
     * @param projectDTO project data to update
     * @param id         project ID
     * @param auth       authentication context
     * @return updated ProjectDTO
     * @throws NoPermissionException       if user doesn't have permission
     * @throws NoSuchElementFoundException if project not found
     */
    @Override
    @Transactional
    public ProjectDTO update(ProjectDTO projectDTO, Long id, Authentication auth)
            throws NoPermissionException, NoSuchElementFoundException {

        projectAuthorizationService.requireOwner(id, auth);

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + id));

        projectValidator.validateUpdate(projectDTO);

        projectFieldUpdater.updateFields(existingProject, projectDTO);

        if (projectDTO.getProjectPhoto() != null && projectDTO.getProjectPhoto().length > 0) {
            dataSizeValidator.validateProjectPhotoSize(projectDTO.getProjectPhoto());
        }

        try {
            Project savedProject = projectRepository.save(existingProject);
            logger.info("Project updated successfully with ID: {} by user: {}",
                    savedProject.getId(), auth.getName());

            // Reload from database to ensure we have the latest data
            Project fullProject = projectRepository.findById(savedProject.getId())
                    .orElse(savedProject);
            initializeElementCollections(fullProject);

            ProjectDTO resultDTO = projectMapper.toDTO(fullProject);
            // Evict cache after update
            evictProjectCache(id);
            return resultDTO;
        } catch (ObjectOptimisticLockingFailureException e) {
            logger.warn("Optimistic locking failure while updating project {}: {}. Retrying once...",
                    id, e.getMessage());
            Project reloadedProject = projectRepository.findById(id)
                    .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + id));
            projectFieldUpdater.updateFields(reloadedProject, projectDTO);

            try {
                Project savedProject = projectRepository.save(reloadedProject);
                logger.info("Project updated successfully on retry with ID: {} by user: {}",
                        savedProject.getId(), auth.getName());
                Project fullProject = projectRepository.findById(savedProject.getId())
                        .orElse(savedProject);
                initializeElementCollections(fullProject);
                evictProjectCache(id);
                return projectMapper.toDTO(fullProject);
            } catch (ObjectOptimisticLockingFailureException retryException) {
                logger.error("Optimistic locking failure on retry for project {}: {}. " +
                        "Project may have been modified by another user.", id, retryException.getMessage());
                throw new NoPermissionException(
                        "Project was modified by another user. Please refresh and try again.");
            }
        }
    }

    /**
     * Deletes a project.
     * Only the project owner can delete the project.
     * Before deleting the project, all related applications and comments are
     * deleted.
     *
     * @param id   project ID
     * @param auth authentication context
     * @throws NoPermissionException       if user doesn't have permission
     * @throws NoSuchElementFoundException if project not found
     */
    @Override
    @Transactional
    public void delete(Long id, Authentication auth)
            throws NoPermissionException, NoSuchElementFoundException {

        projectAuthorizationService.requireOwner(id, auth);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementFoundException("Project not found with id: " + id));

        // Delete all related applications first
        projectApplicationRepository.deleteByProjectId(id);

        // Delete all related comments
        commentRepository.deleteByProjectId(id);

        // Now safe to delete the project
        projectRepository.delete(project);
        // Evict from cache
        evictProjectCache(id);
        logger.info("Project deleted successfully with ID: {} by user: {}", id, auth.getName());
    }

    /**
     * Evicts project from cache.
     * Safe to call even if caching is not enabled.
     */
    private void evictProjectCache(Long projectId) {
        try {
            if (cacheManager != null) {
                org.springframework.cache.Cache cache = cacheManager.getCache("projects");
                if (cache != null) {
                    cache.evict(projectId);
                }
            }
        } catch (Exception e) {
            // Cache not available or not configured - ignore silently
        }
    }

    private void initializeElementCollections(Project project) {
        if (project.getProjectStatuses() != null) {
            Hibernate.initialize(project.getProjectStatuses());
        }
        if (project.getProjectTypes() != null) {
            Hibernate.initialize(project.getProjectTypes());
        }
    }
}
