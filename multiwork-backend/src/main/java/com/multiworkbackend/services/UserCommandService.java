package com.multiworkbackend.services;

import com.multiworkbackend.dto.UserDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

/**
 * Service for user command operations (write).
 * Follows CQRS pattern separation of read and write operations.
 */
public interface UserCommandService {
    
    /**
     * Updates user information.
     *
     * @param userDTO user data to update
     * @param auth authentication context
     * @return updated UserDTO
     * @throws UsernameNotFoundException if user not found
     */
    UserDTO updateUser(UserDTO userDTO, Authentication auth) throws UsernameNotFoundException;
}
