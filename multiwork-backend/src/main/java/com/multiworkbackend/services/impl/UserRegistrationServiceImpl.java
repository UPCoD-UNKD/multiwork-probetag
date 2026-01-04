package com.multiworkbackend.services.impl;

import com.multiworkbackend.config.security.jwt.JwtTokenService;
import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.RegistrationDTO;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.enums.Role;
import com.multiworkbackend.exceptions.AlreadyExistException;
import com.multiworkbackend.repo.UserRepo;
import com.multiworkbackend.services.UserRegistrationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of UserRegistrationService.
 * Handles user registration and initial authentication.
 */
@Service
@RequiredArgsConstructor
public class UserRegistrationServiceImpl implements UserRegistrationService {

    private static final Logger logger = LoggerFactory.getLogger(UserRegistrationServiceImpl.class);

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthenticationResponse register(RegistrationDTO request) throws AlreadyExistException {
        // Validate username uniqueness
        if (userRepo.existsByUsername(request.getUsername())) {
            logger.warn("Registration failed: username {} already exists", request.getUsername());
            throw new AlreadyExistException("Error: Username is already taken!");
        }
        
        // Validate email uniqueness
        if (userRepo.existsByEmail(request.getEmail())) {
            logger.warn("Registration failed: email {} already exists", request.getEmail());
            throw new AlreadyExistException("Error: Email is already taken!");
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .role(Role.USER)
                .build();
        
        User savedUser = userRepo.save(user);
        logger.info("User registered successfully with ID: {}", savedUser.getId());

        // Authenticate user after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT token
        String jwtToken = jwtTokenService.generateToken(authentication);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}
