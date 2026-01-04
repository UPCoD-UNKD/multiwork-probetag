package com.multiworkbackend.services.impl;

import com.multiworkbackend.config.security.jwt.JwtTokenService;
import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.LoginDTO;
import com.multiworkbackend.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Implementation of AuthenticationService.
 * Handles user authentication and JWT token generation.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationServiceImpl.class);

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    @Override
    public AuthenticationResponse authenticate(LoginDTO request) throws BadCredentialsException {
        // Note: We don't check if email exists to prevent timing attacks
        // AuthenticationManager will handle non-existent users
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("User authenticated successfully: {}", request.getEmail());

        // Generate JWT token
        String jwtToken = jwtTokenService.generateToken(authentication);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
