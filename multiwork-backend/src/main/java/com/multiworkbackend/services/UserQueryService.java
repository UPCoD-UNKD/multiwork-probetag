package com.multiworkbackend.services;

import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Service interface for basic user query operations (read-only).
 * Follows CQRS pattern and Interface Segregation Principle.
 * 
 * For project-related queries, see {@link UserProjectQueryService}.
 * For search operations, see {@link UserSearchService}.
 */
public interface UserQueryService {
    
    /**
     * Finds a user by ID and returns DTO.
     *
     * @param id user ID
     * @return UserDTO
     * @throws NoSuchElementFoundException if user not found
     */
    UserDTO findUserById(Long id) throws NoSuchElementFoundException;

    /**
     * Gets the current authenticated user.
     *
     * @param auth authentication context
     * @return UserDTO
     * @throws UsernameNotFoundException if user not found
     */
    UserDTO getCurrentUser(Authentication auth) throws UsernameNotFoundException;
}
