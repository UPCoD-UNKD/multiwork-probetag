package com.multiworkbackend.controllers;

import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.dto.CreateProjectDTO;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.services.ProjectCommandService;
import com.multiworkbackend.services.ProjectCommentService;
import com.multiworkbackend.services.ProjectQueryService;
import com.multiworkbackend.services.ProjectTeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectQueryService projectQueryService;
    private final ProjectCommandService projectCommandService;
    private final ProjectTeamService projectTeamService;
    private final ProjectCommentService projectCommentService;

    @PostMapping("/")
    public ResponseEntity<Object> newProject(@RequestBody @Valid CreateProjectDTO project, Authentication auth) {
        return ResponseEntity.ok(projectCommandService.create(project, auth));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateProject(
            @PathVariable Long id,
            @RequestBody @Valid ProjectDTO project,
            Authentication auth
    ) {
        // Log incoming request for debugging
        if (project.getProjectPhoto() != null) {
            org.slf4j.LoggerFactory.getLogger(ProjectController.class)
                .info("Received project update request with photo: array length = {}", 
                    project.getProjectPhoto().length);
        }
        ProjectDTO result = projectCommandService.update(project, id, auth);
        // Log result
        if (result.getProjectPhoto() != null) {
            org.slf4j.LoggerFactory.getLogger(ProjectController.class)
                .info("Returning updated project with photo: array length = {}", 
                    result.getProjectPhoto().length);
        } else {
            org.slf4j.LoggerFactory.getLogger(ProjectController.class)
                .debug("Returning updated project without photo");
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/")
    public ResponseEntity<Object> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(projectQueryService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectQueryService.findById(id));
    }

    @GetMapping("/find/{skillId}")
    public ResponseEntity<Object> findBySkill(
            @PathVariable Long skillId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction
    ) {
        Sort sort = Sort.by(direction, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(projectQueryService.findBySkill(skillId, pageable));
    }

    @PostMapping("/find")
    public ResponseEntity<Object> findBySimilarProjects(
            @RequestBody Long[] projectIDs,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        // Validate input
        if (projectIDs == null || projectIDs.length == 0) {
            return ResponseEntity.badRequest().body("Project IDs array cannot be empty");
        }
        if (projectIDs.length > 10) {
            return ResponseEntity.badRequest().body("Maximum 10 project IDs allowed");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(projectQueryService.findSimilarProjects(projectIDs, pageable));
    }

    @PatchMapping("/member/{id}")
    public ResponseEntity<Object> addTeamMemberToProject(
            @PathVariable Long id,
            @RequestBody UserDTO user,
            Authentication auth
    ) {
        return ResponseEntity.ok(projectTeamService.addTeamMember(id, user, auth));
    }

    @DeleteMapping("/member/{projectId}/{userId}")
    public ResponseEntity<Object> removeTeamMemberFromProject(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            Authentication auth
    ) {
        return ResponseEntity.ok(projectTeamService.removeTeamMember(projectId, userId, auth));
    }

    @PatchMapping("/{id}/comment")
    public ResponseEntity<Object> addCommentToProject(
            @PathVariable Long id,
            @RequestBody CommentDTO commentDTO,
            Authentication auth
    ) {
        return ResponseEntity.ok(projectCommentService.addComment(id, commentDTO, auth));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteProject(
            @PathVariable Long id,
            Authentication auth
    ) {
        projectCommandService.delete(id, auth);
        return ResponseEntity.ok().body("Project deleted successfully");
    }
}
