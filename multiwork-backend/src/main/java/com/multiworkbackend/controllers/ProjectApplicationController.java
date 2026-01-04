package com.multiworkbackend.controllers;

import com.multiworkbackend.dto.CreateProjectApplicationDTO;
import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectApplicationDTO;
import com.multiworkbackend.enums.ApplicationStatus;
import com.multiworkbackend.services.ProjectApplicationCommandService;
import com.multiworkbackend.services.ProjectApplicationQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for project application operations.
 * Follows RESTful API design principles and separation of concerns.
 */
@RestController
@RequestMapping("/api/project-application")
@RequiredArgsConstructor
public class ProjectApplicationController {

    private final ProjectApplicationQueryService applicationQueryService;
    private final ProjectApplicationCommandService applicationCommandService;

    /**
     * Creates a new project application.
     *
     * @param createDTO application creation data
     * @param auth authentication context
     * @return created ProjectApplicationDTO
     */
    @PostMapping
    public ResponseEntity<Object> createApplication(
            @RequestBody @Valid CreateProjectApplicationDTO createDTO,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationCommandService.create(createDTO, auth));
    }

    /**
     * Gets all applications for a project (project creator only).
     *
     * @param projectId project ID
     * @param page page number (default: 0)
     * @param size page size (default: 20)
     * @param sortBy sort field (default: "createdAt")
     * @param direction sort direction (default: "DESC")
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<Object> getApplicationsByProject(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction,
            Authentication auth
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(applicationQueryService.findByProjectId(projectId, pageable, auth));
    }

    /**
     * Gets all applications for a project by status (project creator only).
     *
     * @param projectId project ID
     * @param status application status
     * @param page page number (default: 0)
     * @param size page size (default: 20)
     * @param sortBy sort field (default: "createdAt")
     * @param direction sort direction (default: "DESC")
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<Object> getApplicationsByProjectAndStatus(
            @PathVariable Long projectId,
            @PathVariable ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction,
            Authentication auth
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(applicationQueryService.findByProjectIdAndStatus(projectId, status, pageable, auth));
    }

    /**
     * Gets all applications by current user.
     *
     * @param page page number (default: 0)
     * @param size page size (default: 20)
     * @param sortBy sort field (default: "createdAt")
     * @param direction sort direction (default: "DESC")
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    @GetMapping("/my-applications")
    public ResponseEntity<Object> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction,
            Authentication auth
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(applicationQueryService.findByCurrentUser(pageable, auth));
    }

    /**
     * Gets all applications by current user with specific status.
     *
     * @param status application status
     * @param page page number (default: 0)
     * @param size page size (default: 20)
     * @param sortBy sort field (default: "createdAt")
     * @param direction sort direction (default: "DESC")
     * @param auth authentication context
     * @return PageResponse containing paginated applications
     */
    @GetMapping("/my-applications/status/{status}")
    public ResponseEntity<Object> getMyApplicationsByStatus(
            @PathVariable ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction,
            Authentication auth
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(applicationQueryService.findByCurrentUserAndStatus(status, pageable, auth));
    }

    /**
     * Gets a specific application by ID.
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return ProjectApplicationDTO
     */
    @GetMapping("/{applicationId}")
    public ResponseEntity<Object> getApplicationById(
            @PathVariable Long applicationId,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationQueryService.findById(applicationId, auth));
    }

    /**
     * Gets count of pending applications for a project (project creator only).
     *
     * @param projectId project ID
     * @param auth authentication context
     * @return count of pending applications
     */
    @GetMapping("/project/{projectId}/pending-count")
    public ResponseEntity<Object> getPendingCount(
            @PathVariable Long projectId,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationQueryService.countPendingByProjectId(projectId, auth));
    }

    /**
     * Approves a project application (project creator only).
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     */
    @PostMapping("/{applicationId}/approve")
    public ResponseEntity<Object> approveApplication(
            @PathVariable Long applicationId,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationCommandService.approve(applicationId, auth));
    }

    /**
     * Rejects a project application (project creator only).
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     */
    @PostMapping("/{applicationId}/reject")
    public ResponseEntity<Object> rejectApplication(
            @PathVariable Long applicationId,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationCommandService.reject(applicationId, auth));
    }

    /**
     * Cancels a project application (applicant only).
     *
     * @param applicationId application ID
     * @param auth authentication context
     * @return updated ProjectApplicationDTO
     */
    @PostMapping("/{applicationId}/cancel")
    public ResponseEntity<Object> cancelApplication(
            @PathVariable Long applicationId,
            Authentication auth
    ) {
        return ResponseEntity.ok(applicationCommandService.cancel(applicationId, auth));
    }
}
