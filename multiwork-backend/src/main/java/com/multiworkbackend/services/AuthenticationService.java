package com.multiworkbackend.services;

import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.LoginDTO;
import org.springframework.security.authentication.BadCredentialsException;

/**
 * Service for user authentication operations.
 * Handles user login and JWT token generation.
 */
public interface AuthenticationService {
    
    /**
     * Authenticates a user and returns JWT token.
     * 
     * @param request login credentials
     * @return AuthenticationResponse with JWT token
     * @throws BadCredentialsException if authentication fails
     */
    AuthenticationResponse authenticate(LoginDTO request) throws BadCredentialsException;
}
