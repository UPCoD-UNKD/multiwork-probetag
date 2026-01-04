package com.multiworkbackend.controllers;

import com.multiworkbackend.dto.LoginDTO;
import com.multiworkbackend.dto.RegistrationDTO;
import com.multiworkbackend.services.AuthenticationService;
import com.multiworkbackend.services.UserRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserRegistrationService registrationService;
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody @Valid RegistrationDTO request) {
        return ResponseEntity.ok(registrationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody @Valid LoginDTO request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
