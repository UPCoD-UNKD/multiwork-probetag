package com.multiworkbackend.services;

import com.multiworkbackend.config.security.jwt.JwtTokenService;
import com.multiworkbackend.dto.AuthenticationResponse;
import com.multiworkbackend.dto.LoginDTO;
import com.multiworkbackend.services.impl.AuthenticationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("AuthenticationService Unit Tests")
class AuthenticationServiceTest {

    @Mock
    private JwtTokenService jwtTokenService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationServiceImpl authenticationService;

    private LoginDTO loginDTO;
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        loginDTO = LoginDTO.builder()
                .email("test@example.com")
                .password("Test1234")
                .build();

        authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("test@example.com");
    }

    @Test
    @DisplayName("Should successfully authenticate a user")
    void testAuthenticate_Success() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenService.generateToken(any(Authentication.class))).thenReturn("jwt-token");

        // When
        AuthenticationResponse response = authenticationService.authenticate(loginDTO);

        // Then
        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("jwt-token", response.getToken());
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenService, times(1)).generateToken(any(Authentication.class));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when authentication fails")
    void testAuthenticate_BadCredentials() {
        // Given
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // When & Then
        assertThrows(BadCredentialsException.class, () -> {
            authenticationService.authenticate(loginDTO);
        });

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenService, never()).generateToken(any(Authentication.class));
    }

}
