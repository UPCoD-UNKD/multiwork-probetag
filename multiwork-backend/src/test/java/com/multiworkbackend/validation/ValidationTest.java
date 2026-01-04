package com.multiworkbackend.validation;

import com.multiworkbackend.dto.LoginDTO;
import com.multiworkbackend.dto.RegistrationDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Validation Tests")
class ValidationTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("Should validate valid RegistrationDTO")
    void testRegistrationDTO_Valid() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("testuser")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should reject invalid email in RegistrationDTO")
    void testRegistrationDTO_InvalidEmail() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("invalid-email")
                .username("testuser")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    @DisplayName("Should reject short password in RegistrationDTO")
    void testRegistrationDTO_ShortPassword() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("testuser")
                .password("Short1")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    @DisplayName("Should reject password without uppercase letter")
    void testRegistrationDTO_PasswordNoUppercase() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("testuser")
                .password("test1234")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    @DisplayName("Should reject password without digit")
    void testRegistrationDTO_PasswordNoDigit() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("testuser")
                .password("TestPassword")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }

    @Test
    @DisplayName("Should reject short username in RegistrationDTO")
    void testRegistrationDTO_ShortUsername() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("ab")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    @DisplayName("Should reject blank username in RegistrationDTO")
    void testRegistrationDTO_BlankUsername() {
        // Given
        RegistrationDTO dto = RegistrationDTO.builder()
                .email("test@example.com")
                .username("")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<RegistrationDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("username")));
    }

    @Test
    @DisplayName("Should validate valid LoginDTO")
    void testLoginDTO_Valid() {
        // Given
        LoginDTO dto = LoginDTO.builder()
                .email("test@example.com")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<LoginDTO>> violations = validator.validate(dto);

        // Then
        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Should reject blank email in LoginDTO")
    void testLoginDTO_BlankEmail() {
        // Given
        LoginDTO dto = LoginDTO.builder()
                .email("")
                .password("Test1234")
                .build();

        // When
        Set<ConstraintViolation<LoginDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    @DisplayName("Should reject blank password in LoginDTO")
    void testLoginDTO_BlankPassword() {
        // Given
        LoginDTO dto = LoginDTO.builder()
                .email("test@example.com")
                .password("")
                .build();

        // When
        Set<ConstraintViolation<LoginDTO>> violations = validator.validate(dto);

        // Then
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream()
                .anyMatch(v -> v.getPropertyPath().toString().equals("password")));
    }
}
