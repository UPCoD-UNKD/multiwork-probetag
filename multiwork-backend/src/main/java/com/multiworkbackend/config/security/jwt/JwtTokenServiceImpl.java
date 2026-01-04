package com.multiworkbackend.config.security.jwt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * Implementation of JwtTokenService.
 * Delegates to JwtUtils for actual JWT operations.
 */
@Service
public class JwtTokenServiceImpl implements JwtTokenService {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenServiceImpl.class);

    private final JwtUtils jwtUtils;

    public JwtTokenServiceImpl(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public String generateToken(Authentication authentication) {
        return jwtUtils.generateJwtToken(authentication);
    }

    @Override
    public String getUsernameFromToken(String token) {
        return jwtUtils.getUserNameFromJwtToken(token);
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtils.validateJwtToken(token);
    }
}
