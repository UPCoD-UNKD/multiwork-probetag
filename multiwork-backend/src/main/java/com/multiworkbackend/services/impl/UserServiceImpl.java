package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.UserCommandService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.services.UserProjectQueryService;
import com.multiworkbackend.services.UserQueryService;
import com.multiworkbackend.services.UserSearchService;
import com.multiworkbackend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Facade service that delegates to specialized user services.
 * Maintains backward compatibility with existing UserService interface.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserEntityService userEntityService;
    private final UserQueryService userQueryService;
    private final UserProjectQueryService userProjectQueryService;
    private final UserSearchService userSearchService;
    private final UserCommandService userCommandService;

    // Delegate entity operations
    @Override
    public User getUserByUsername(String username) throws UsernameNotFoundException {
        return userEntityService.getUserByUsername(username);
    }

    @Override
    public User getUserById(Long id) throws NoSuchElementFoundException {
        return userEntityService.getUserById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userEntityService.getUserByEmail(email);
    }

    @Override
    public Optional<User> getUserByUsernameOptional(String username) {
        return userEntityService.getUserByUsernameOptional(username);
    }

    // Delegate query operations
    @Override
    public UserDTO findUserById(Long id) throws NoSuchElementFoundException {
        return userQueryService.findUserById(id);
    }

    @Override
    public UserDTO getCurrentUser(Authentication auth) throws UsernameNotFoundException {
        return userQueryService.getCurrentUser(auth);
    }

    @Override
    public List<ProjectDTO> getCurrentUserProjects(Authentication auth) throws UsernameNotFoundException {
        return userProjectQueryService.getCurrentUserProjects(auth);
    }
    
    @Override
    public PageResponse<UserDTO> findUserBySkill(Long id, Pageable pageable) throws NoSuchElementFoundException {
        return userSearchService.findUserBySkill(id, pageable);
    }

    // Delegate command operations
    @Override
    public UserDTO updateUser(UserDTO userDTO, Authentication auth) throws UsernameNotFoundException {
        return userCommandService.updateUser(userDTO, auth);
    }
}
