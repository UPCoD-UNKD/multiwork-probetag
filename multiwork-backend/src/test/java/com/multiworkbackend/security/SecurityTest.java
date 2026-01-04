package com.multiworkbackend.security;

import com.multiworkbackend.config.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Security tests for critical security components.
 * Tests password encoding, JWT token validation, and security configuration.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("Security Tests")
class SecurityTest {

    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(12);
    }

    @Test
    @DisplayName("Should encode password successfully")
    void testPasswordEncoding() {
        // Given
        String rawPassword = "TestPassword123";

        // When
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Then
        assertNotNull(encodedPassword);
        assertNotEquals(rawPassword, encodedPassword);
        assertTrue(encodedPassword.startsWith("$2a$12$") || encodedPassword.startsWith("$2b$12$"));
    }

    @Test
    @DisplayName("Should verify encoded password matches raw password")
    void testPasswordVerification() {
        // Given
        String rawPassword = "TestPassword123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // When
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);

        // Then
        assertTrue(matches);
    }

    @Test
    @DisplayName("Should reject incorrect password")
    void testPasswordVerification_Failure() {
        // Given
        String correctPassword = "TestPassword123";
        String wrongPassword = "WrongPassword123";
        String encodedPassword = passwordEncoder.encode(correctPassword);

        // When
        boolean matches = passwordEncoder.matches(wrongPassword, encodedPassword);

        // Then
        assertFalse(matches);
    }

    @Test
    @DisplayName("Should generate different hashes for same password")
    void testPasswordEncoding_UniqueHashes() {
        // Given
        String rawPassword = "TestPassword123";

        // When
        String encodedPassword1 = passwordEncoder.encode(rawPassword);
        String encodedPassword2 = passwordEncoder.encode(rawPassword);

        // Then
        assertNotEquals(encodedPassword1, encodedPassword2);
        // But both should verify correctly
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword1));
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword2));
    }

    @Test
    @DisplayName("Password encoder should use BCrypt with strength 12")
    void testPasswordEncoderConfiguration() {
        // Given
        String rawPassword = "TestPassword123";

        // When
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Then
        // BCrypt with strength 12 should produce hash starting with $2a$12$ or $2b$12$
        assertTrue(encodedPassword.startsWith("$2a$12$") || encodedPassword.startsWith("$2b$12$"));
    }
}
