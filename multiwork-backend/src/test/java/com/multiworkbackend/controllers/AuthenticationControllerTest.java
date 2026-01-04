package com.multiworkbackend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.LoginDTO;
import com.multiworkbackend.dto.RegistrationDTO;
import com.multiworkbackend.exceptions.AlreadyExistException;
import com.multiworkbackend.services.AuthenticationService;
import com.multiworkbackend.services.UserRegistrationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AuthenticationController API Tests")
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRegistrationService registrationService;

    @MockBean
    private AuthenticationService authenticationService;

    @Test
    @DisplayName("POST /api/auth/register - Should register user successfully")
    void testRegister_Success() throws Exception {
        RegistrationDTO registrationDTO = RegistrationDTO.builder()
                .username("testuser")
                .email("test@example.com")
                .password("Password123")
                .build();

        AuthenticationResponse response = AuthenticationResponse.builder()
                .token("jwt-token-here")
                .build();

        when(registrationService.register(any(RegistrationDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value("jwt-token-here"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 when username already exists")
    void testRegister_UsernameExists() throws Exception {
        RegistrationDTO registrationDTO = RegistrationDTO.builder()
                .username("existinguser")
                .email("new@example.com")
                .password("Password123")
                .build();

        when(registrationService.register(any(RegistrationDTO.class)))
                .thenThrow(new AlreadyExistException("Username already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Username already exists"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 when email already exists")
    void testRegister_EmailExists() throws Exception {
        RegistrationDTO registrationDTO = RegistrationDTO.builder()
                .username("newuser")
                .email("existing@example.com")
                .password("Password123")
                .build();

        when(registrationService.register(any(RegistrationDTO.class)))
                .thenThrow(new AlreadyExistException("Email already exists"));

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registrationDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should return 400 when validation fails")
    void testRegister_ValidationError() throws Exception {
        RegistrationDTO invalidDTO = RegistrationDTO.builder()
                .username("ab")
                .email("invalid-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("POST /api/auth/login - Should login user successfully")
    void testLogin_Success() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .email("test@example.com")
                .password("password123")
                .build();

        AuthenticationResponse response = AuthenticationResponse.builder()
                .token("jwt-token-here")
                .build();

        when(authenticationService.authenticate(any(LoginDTO.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value("jwt-token-here"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return 401 when credentials are invalid")
    void testLogin_InvalidCredentials() throws Exception {
        LoginDTO loginDTO = LoginDTO.builder()
                .email("test@example.com")
                .password("wrongpassword")
                .build();

        when(authenticationService.authenticate(any(LoginDTO.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Error: Invalid email or password!"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should return 400 when validation fails")
    void testLogin_ValidationError() throws Exception {
        LoginDTO invalidDTO = LoginDTO.builder()
                .email("invalid-email")
                .password("")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").exists());
    }
}
