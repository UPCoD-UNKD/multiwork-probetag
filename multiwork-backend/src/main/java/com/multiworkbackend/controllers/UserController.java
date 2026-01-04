package com.multiworkbackend.controllers;

import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.services.UserCommandService;
import com.multiworkbackend.services.UserProjectQueryService;
import com.multiworkbackend.services.UserQueryService;
import com.multiworkbackend.services.UserSearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserQueryService userQueryService;
    private final UserProjectQueryService userProjectQueryService;
    private final UserSearchService userSearchService;
    private final UserCommandService userCommandService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> findUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userQueryService.findUserById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<Object> getCurrentUser(Authentication auth) {
        return ResponseEntity.ok(userQueryService.getCurrentUser(auth));
    }

    @GetMapping("/me/projects")
    public ResponseEntity<Object> getCurrentUserProjects(Authentication auth) {
        return ResponseEntity.ok(userProjectQueryService.getCurrentUserProjects(auth));
    }

    @PutMapping
    public ResponseEntity<Object> updateUser(
            @RequestBody @Valid UserDTO userDTO,
            Authentication auth
    ) {
        return ResponseEntity.ok(userCommandService.updateUser(userDTO, auth));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Object> findBySkill(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(userSearchService.findUserBySkill(id, pageable));
    }

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }


}
