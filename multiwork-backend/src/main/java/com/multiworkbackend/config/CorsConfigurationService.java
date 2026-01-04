package com.multiworkbackend.config;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.List;

/**
 * Service for CORS configuration management.
 * Follows Single Responsibility Principle by focusing solely on CORS configuration logic.
 */
@Service
@RequiredArgsConstructor
public class CorsConfigurationService {

    private static final Logger logger = LoggerFactory.getLogger(CorsConfigurationService.class);

    private final Environment environment;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String[] allowedOrigins;

    @Value("${app.cors.allowed-methods:*}")
    private String[] allowedMethods;

    @Value("${app.cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${app.cors.allow-credentials:true}")
    private boolean allowCredentials;

    /**
     * Checks if the application is running in production environment.
     *
     * @return true if production profile is active
     */
    public boolean isProduction() {
        String[] activeProfiles = environment.getActiveProfiles();
        return Arrays.asList(activeProfiles).contains("prod") ||
               Arrays.asList(activeProfiles).contains("production");
    }

    /**
     * Configures CORS settings based on environment.
     * Applies stricter security policies for production.
     *
     * @param configuration CORS configuration to update
     */
    public void configureCors(CorsConfiguration configuration) {
        boolean isProd = isProduction();

        if (isProd) {
            logger.info("Configuring CORS for PRODUCTION environment with strict security");
            configureProductionCors(configuration);
        } else {
            configureDevelopmentCors(configuration);
        }
    }

    /**
     * Configures CORS with strict security settings for production.
     *
     * @param configuration CORS configuration to update
     */
    private void configureProductionCors(CorsConfiguration configuration) {
        // Set allowed origins - must be explicitly configured in production
        List<String> origins = Arrays.asList(allowedOrigins);
        if (origins.contains("*")) {
            logger.warn("WARNING: Wildcard origin '*' detected in production! This is a security risk.");
            throw new IllegalStateException(
                "Wildcard origin '*' is not allowed in production. " +
                "Please specify exact allowed origins in app.cors.allowed-origins property."
            );
        }
        configuration.setAllowedOrigins(origins);

        // Set allowed methods - restrict to only necessary methods in production
        if (allowedMethods.length == 1 && "*".equals(allowedMethods[0])) {
            logger.warn("Wildcard methods '*' detected in production. Using safe default methods.");
            configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        } else {
            configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        }

        // Set allowed headers - restrict in production
        if (allowedHeaders.length == 1 && "*".equals(allowedHeaders[0])) {
            logger.warn("Wildcard headers '*' detected in production. Using safe default headers.");
            configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
            ));
        } else {
            configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        }

        // Set exposed headers (minimal set for production)
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Allow credentials only if explicitly configured
        configuration.setAllowCredentials(allowCredentials);

        // Set max age for preflight requests (1 hour in production)
        configuration.setMaxAge(3600L);
    }

    /**
     * Configures CORS with more permissive settings for development.
     * Allows localhost and local network IP addresses for testing from other devices.
     *
     * @param configuration CORS configuration to update
     */
    private void configureDevelopmentCors(CorsConfiguration configuration) {
        // In development, allow localhost and local network IPs
        // This enables access from other devices on the same network
        List<String> origins = Arrays.asList(allowedOrigins);
        
        // Build list of origin patterns for local network access
        // This allows access from other devices in the local network
        List<String> originPatterns = new java.util.ArrayList<>(Arrays.asList(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://192.168.*.*:*",
            "http://10.*.*.*:*",
            "http://172.16.*.*:*",
            "http://172.17.*.*:*",
            "http://172.18.*.*:*",
            "http://172.19.*.*:*",
            "http://172.20.*.*:*",
            "http://172.21.*.*:*",
            "http://172.22.*.*:*",
            "http://172.23.*.*:*",
            "http://172.24.*.*:*",
            "http://172.25.*.*:*",
            "http://172.26.*.*:*",
            "http://172.27.*.*:*",
            "http://172.28.*.*:*",
            "http://172.29.*.*:*",
            "http://172.30.*.*:*",
            "http://172.31.*.*:*"
        ));
        
        // Add explicitly configured origins as patterns if they don't contain wildcards
        for (String origin : origins) {
            if (!origin.contains("*") && !originPatterns.contains(origin)) {
                // Convert exact origin to pattern format
                originPatterns.add(origin.replace(":3000", ":*"));
            }
        }
        
        // Use setAllowedOriginPatterns (not setAllowedOrigins) to support wildcards
        configuration.setAllowedOriginPatterns(originPatterns);

        // Set allowed methods
        if (allowedMethods.length == 1 && "*".equals(allowedMethods[0])) {
            configuration.addAllowedMethod("*");
        } else {
            configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        }

        // Set allowed headers
        if (allowedHeaders.length == 1 && "*".equals(allowedHeaders[0])) {
            configuration.addAllowedHeader("*");
        } else {
            configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        }

        configuration.setAllowCredentials(allowCredentials);

        // Longer max age for development convenience
        configuration.setMaxAge(86400L); // 24 hours
    }
}
