package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.mapper.ProjectMapper;
import com.multiworkbackend.mapper.UserMapper;
import com.multiworkbackend.repo.UserRepo;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.services.UserProjectQueryService;
import com.multiworkbackend.services.UserQueryService;
import com.multiworkbackend.services.UserSearchService;
import com.multiworkbackend.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of user query services for read-only user operations.
 * Follows CQRS pattern, Interface Segregation Principle, and best practices for query services.
 */
@Service
@RequiredArgsConstructor
public class UserQueryServiceImpl implements UserQueryService, UserProjectQueryService, UserSearchService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final ProjectMapper projectMapper;
    private final SkillService skillService;

    @Override
    @Transactional(readOnly = true)
    public UserDTO findUserById(Long id) throws NoSuchElementFoundException {
        var user = userRepo.findByIdWithDetails(id)
                .orElseThrow(() -> new NoSuchElementFoundException("User Not Found with id: " + id));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(Authentication auth) throws UsernameNotFoundException {
        // findByUsername with @EntityGraph eagerly fetches all related entities
        // to avoid lazy initialization issues
        var user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + auth.getName()));
        return userMapper.toDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> getCurrentUserProjects(Authentication auth) throws UsernameNotFoundException {
        // Use EntityGraph to eagerly fetch projects with their related entities
        // This avoids N+1 query problem
        var user = userRepo.findByUsernameWithProjects(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + auth.getName()));
        
        List<ProjectDTO> projects = new ArrayList<>();
        if (user.getMemberProjects() != null) {
            // Projects are already loaded with their related entities via EntityGraph
            // But @ElementCollection collections need manual initialization
            user.getMemberProjects().forEach(project -> {
                // Force initialization of @ElementCollection collections
                if (project.getProjectStatuses() != null) {
                    Hibernate.initialize(project.getProjectStatuses());
                }
                if (project.getProjectTypes() != null) {
                    Hibernate.initialize(project.getProjectTypes());
                }
                projects.add(projectMapper.toDTO(project));
            });
        }
        return projects;
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserDTO> findUserBySkill(Long id, Pageable pageable) throws NoSuchElementFoundException {
        // Verify skill exists
        skillService.findById(id);
        
        var userPage = userRepo.findAllBySkillId(id, pageable);
        
        if (userPage.isEmpty()) {
            throw new NoSuchElementFoundException("No users found with skill id: " + id);
        }
        
        return PageResponseUtil.toPageResponse(userPage, userMapper::toDTO);
    }
}
