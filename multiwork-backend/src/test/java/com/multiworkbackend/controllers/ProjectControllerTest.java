package com.multiworkbackend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.multiworkbackend.dto.*;
import com.multiworkbackend.exceptions.NoPermissionException;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.ProjectCommandService;
import com.multiworkbackend.services.ProjectCommentService;
import com.multiworkbackend.services.ProjectQueryService;
import com.multiworkbackend.services.ProjectTeamService;
import com.multiworkbackend.dto.PageResponse;
import org.springframework.data.domain.Pageable;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for ProjectController.
 * Uses @SpringBootTest with H2 in-memory database for full context loading.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("ProjectController API Tests")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectQueryService projectQueryService;
    
    @MockBean
    private ProjectCommandService projectCommandService;
    
    @MockBean
    private ProjectTeamService projectTeamService;
    
    @MockBean
    private ProjectCommentService projectCommentService;

    @Test
    @DisplayName("Should create project successfully")
    @WithMockUser(username = "testuser")
    void testCreateProject_Success() throws Exception {
        // Given
        CreateProjectDTO createProjectDTO = CreateProjectDTO.builder()
                .projectName("New Project")
                .description("Project Description")
                .build();

        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("New Project")
                .description("Project Description")
                .date(LocalDate.now())
                .build();

        when(projectCommandService.create(any(CreateProjectDTO.class), any())).thenReturn(projectDTO);

        // When & Then
        mockMvc.perform(post("/api/project/")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createProjectDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.projectName").value("New Project"));
    }

    @Test
    @DisplayName("Should return 400 when project creation validation fails")
    @WithMockUser(username = "testuser")
    void testCreateProject_ValidationError() throws Exception {
        // Given
        CreateProjectDTO invalidDTO = CreateProjectDTO.builder()
                .projectName("")
                .build();

        // When & Then
        mockMvc.perform(post("/api/project/")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should get all projects successfully")
    @WithMockUser
    void testGetAllProjects_Success() throws Exception {
        // Given
        ProjectDTO project1 = ProjectDTO.builder()
                .id(1L)
                .projectName("Project 1")
                .build();
        ProjectDTO project2 = ProjectDTO.builder()
                .id(2L)
                .projectName("Project 2")
                .build();
        List<ProjectDTO> projects = Arrays.asList(project1, project2);

        PageResponse<ProjectDTO> pageResponse = PageResponse.<ProjectDTO>builder()
                .content(projects)
                .totalElements(2L)
                .totalPages(1)
                .page(0)
                .size(20)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        when(projectQueryService.findAll(any(Pageable.class))).thenReturn(pageResponse);

        // When & Then
        mockMvc.perform(get("/api/project/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(true));
    }

    @Test
    @DisplayName("Should get project by id successfully")
    @WithMockUser
    void testGetProjectById_Success() throws Exception {
        // Given
        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Test Project")
                .description("Test Description")
                .build();

        when(projectQueryService.findById(1L)).thenReturn(projectDTO);

        // When & Then
        mockMvc.perform(get("/api/project/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.projectName").value("Test Project"));
    }

    @Test
    @DisplayName("Should return 404 when project not found")
    @WithMockUser
    void testGetProjectById_NotFound() throws Exception {
        // Given
        when(projectQueryService.findById(anyLong()))
                .thenThrow(new NoSuchElementFoundException("Project not found with id: 999"));

        // When & Then
        mockMvc.perform(get("/api/project/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should update project successfully when user is owner")
    @WithMockUser(username = "testuser")
    void testUpdateProject_Success() throws Exception {
        // Given
        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Updated Project")
                .description("Updated Description")
                .build();

        when(projectCommandService.update(any(ProjectDTO.class), anyLong(), any())).thenReturn(projectDTO);

        // When & Then
        mockMvc.perform(put("/api/project/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectName").value("Updated Project"));
    }

    @Test
    @DisplayName("Should return 403 when user is not owner")
    @WithMockUser(username = "testuser")
    void testUpdateProject_NoPermission() throws Exception {
        // Given
        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Updated Project")
                .build();

        when(projectCommandService.update(any(ProjectDTO.class), anyLong(), any()))
                .thenThrow(new NoPermissionException("User is not the owner of that project"));

        // When & Then
        mockMvc.perform(put("/api/project/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectDTO)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should add team member successfully")
    @WithMockUser(username = "testuser")
    void testAddTeamMember_Success() throws Exception {
        // Given
        UserDTO userDTO = UserDTO.builder()
                .id(2L)
                .username("newmember")
                .build();

        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Test Project")
                .members(new HashSet<>())
                .build();

        when(projectTeamService.addTeamMember(anyLong(), any(UserDTO.class), any())).thenReturn(projectDTO);

        // When & Then
        mockMvc.perform(patch("/api/project/member/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDTO)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Should add comment successfully")
    @WithMockUser(username = "testuser")
    void testAddComment_Success() throws Exception {
        // Given
        CommentDTO commentDTO = CommentDTO.builder()
                .text("Test comment")
                .build();

        CommentDTO savedComment = CommentDTO.builder()
                .id(1L)
                .text("Test comment")
                .build();

        when(projectCommentService.addComment(anyLong(), any(CommentDTO.class), any())).thenReturn(savedComment);

        // When & Then
        mockMvc.perform(patch("/api/project/1/comment")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value("Test comment"));
    }

    @Test
    @DisplayName("Should find projects by skill successfully")
    @WithMockUser
    void testFindBySkill_Success() throws Exception {
        // Given
        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Java Project")
                .build();
        List<ProjectDTO> projects = Arrays.asList(projectDTO);

        PageResponse<ProjectDTO> pageResponse = PageResponse.<ProjectDTO>builder()
                .content(projects)
                .totalElements(1L)
                .totalPages(1)
                .page(0)
                .size(20)
                .build();
        when(projectQueryService.findBySkill(eq(1L), any(Pageable.class))).thenReturn(pageResponse);

        // When & Then
        mockMvc.perform(get("/api/project/find/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].projectName").value("Java Project"));
    }

    @Test
    @DisplayName("Should find similar projects successfully")
    @WithMockUser
    void testFindSimilarProjects_Success() throws Exception {
        // Given
        Long[] projectIDs = {1L, 2L};
        ProjectDTO similarProject = ProjectDTO.builder()
                .id(3L)
                .projectName("Similar Project")
                .build();
        List<ProjectDTO> similarProjects = Arrays.asList(similarProject);

        PageResponse<ProjectDTO> pageResponse = PageResponse.<ProjectDTO>builder()
                .content(similarProjects)
                .totalElements(1L)
                .totalPages(1)
                .page(0)
                .size(20)
                .build();
        when(projectQueryService.findSimilarProjects(any(Long[].class), any(Pageable.class))).thenReturn(pageResponse);

        // When & Then
        mockMvc.perform(post("/api/project/find")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(projectIDs)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].id").value(3L))
                .andExpect(jsonPath("$.content[0].projectName").value("Similar Project"));
    }
}
