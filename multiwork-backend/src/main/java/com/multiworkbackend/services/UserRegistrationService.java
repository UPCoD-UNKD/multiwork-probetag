package com.multiworkbackend.services;

import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.RegistrationDTO;
import com.multiworkbackend.exceptions.AlreadyExistException;

/**
 * Service for user registration operations.
 * Handles user registration and initial authentication after registration.
 */
public interface UserRegistrationService {
    
    /**
     * Registers a new user and returns authentication token.
     * 
     * @param request registration data
     * @return AuthenticationResponse with JWT token
     * @throws AlreadyExistException if username or email already exists
     */
    AuthenticationResponse register(RegistrationDTO request) throws AlreadyExistException;
}
