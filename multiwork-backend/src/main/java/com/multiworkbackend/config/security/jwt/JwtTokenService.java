package com.multiworkbackend.config.security.jwt;

import org.springframework.security.core.Authentication;

/**
 * Service interface for JWT token operations.
 * Provides abstraction over JWT token generation and validation.
 */
public interface JwtTokenService {
    
    /**
     * Generates a JWT token for the authenticated user.
     * 
     * @param authentication authentication context
     * @return JWT token string
     */
    String generateToken(Authentication authentication);
    
    /**
     * Extracts username from JWT token.
     * 
     * @param token JWT token
     * @return username
     */
    String getUsernameFromToken(String token);
    
    /**
     * Validates JWT token.
     * 
     * @param token JWT token to validate
     * @return true if token is valid, false otherwise
     */
    boolean validateToken(String token);
}
