package com.multiworkbackend.services;

import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

/**
 * Service for internal user entity operations.
 * Used by other services that need to work with User entities directly.
 */
public interface UserEntityService {
    
    /**
     * Gets a User entity by username.
     * Used internally by services that need the full entity.
     *
     * @param username the username
     * @return User entity
     * @throws UsernameNotFoundException if user not found
     */
    User getUserByUsername(String username) throws UsernameNotFoundException;

    /**
     * Gets a User entity by ID.
     * Used internally by services that need the full entity.
     *
     * @param id the user ID
     * @return User entity
     * @throws NoSuchElementFoundException if user not found
     */
    User getUserById(Long id) throws NoSuchElementFoundException;
    
    /**
     * Gets a User entity by email.
     *
     * @param email the email
     * @return Optional User entity
     */
    Optional<User> getUserByEmail(String email);
    
    /**
     * Gets a User entity by username.
     *
     * @param username the username
     * @return Optional User entity
     */
    Optional<User> getUserByUsernameOptional(String username);
}
