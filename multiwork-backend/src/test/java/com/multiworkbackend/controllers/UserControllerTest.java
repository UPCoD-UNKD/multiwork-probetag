package com.multiworkbackend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.UserCommandService;
import com.multiworkbackend.services.UserProjectQueryService;
import com.multiworkbackend.services.UserQueryService;
import com.multiworkbackend.services.UserSearchService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("UserController API Tests")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserQueryService userQueryService;

    @MockBean
    private UserProjectQueryService userProjectQueryService;

    @MockBean
    private UserSearchService userSearchService;

    @MockBean
    private UserCommandService userCommandService;

    @Test
    @DisplayName("GET /api/user/{id} - Should return user by id successfully")
    @WithMockUser
    void testGetUserById_Success() throws Exception {
        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .bio("Test bio")
                .avatar("avatar-url")
                .skills(new HashSet<>())
                .links(new HashSet<>())
                .socialMediaSet(new HashSet<>())
                .build();

        when(userQueryService.findUserById(1L)).thenReturn(userDTO);

        mockMvc.perform(get("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.fullName").value("Test User"))
                .andExpect(jsonPath("$.bio").value("Test bio"))
                .andExpect(jsonPath("$.avatar").value("avatar-url"))
                .andExpect(jsonPath("$.skills").isArray())
                .andExpect(jsonPath("$.links").isArray())
                .andExpect(jsonPath("$.socialMediaSet").isArray());
    }

    @Test
    @DisplayName("GET /api/user/{id} - Should return 404 when user not found")
    @WithMockUser
    void testGetUserById_NotFound() throws Exception {
        when(userQueryService.findUserById(anyLong()))
                .thenThrow(new NoSuchElementFoundException("User Not Found with id: 999"));

        mockMvc.perform(get("/api/user/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value(containsString("User Not Found with id: 999")));
    }

    @Test
    @DisplayName("GET /api/user/me - Should return current authenticated user")
    @WithMockUser(username = "testuser")
    void testGetCurrentUser_Success() throws Exception {
        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .build();

        when(userQueryService.getCurrentUser(any(Authentication.class))).thenReturn(userDTO);

        mockMvc.perform(get("/api/user/me"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    @DisplayName("GET /api/user/me/projects - Should return current user projects")
    @WithMockUser(username = "testuser")
    void testGetCurrentUserProjects_Success() throws Exception {
        ProjectDTO project1 = ProjectDTO.builder()
                .id(1L)
                .projectName("Project 1")
                .date(LocalDate.now())
                .build();
        ProjectDTO project2 = ProjectDTO.builder()
                .id(2L)
                .projectName("Project 2")
                .date(LocalDate.now())
                .build();
        List<ProjectDTO> projects = Arrays.asList(project1, project2);

        when(userProjectQueryService.getCurrentUserProjects(any(Authentication.class))).thenReturn(projects);

        mockMvc.perform(get("/api/user/me/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].projectName").value("Project 1"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].projectName").value("Project 2"));
    }

    @Test
    @DisplayName("GET /api/user/me/projects - Should return empty array when user has no projects")
    @WithMockUser(username = "testuser")
    void testGetCurrentUserProjects_Empty() throws Exception {
        when(userProjectQueryService.getCurrentUserProjects(any(Authentication.class))).thenReturn(List.of());

        mockMvc.perform(get("/api/user/me/projects"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("PUT /api/user - Should update user successfully")
    @WithMockUser(username = "testuser")
    void testUpdateUser_Success() throws Exception {
        UserDTO updateDTO = UserDTO.builder()
                .fullName("Updated Name")
                .bio("Updated bio")
                .avatar("new-avatar-url")
                .build();

        UserDTO updatedUser = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Updated Name")
                .bio("Updated bio")
                .avatar("new-avatar-url")
                .build();

        when(userCommandService.updateUser(any(UserDTO.class), any(Authentication.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/user")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.bio").value("Updated bio"))
                .andExpect(jsonPath("$.avatar").value("new-avatar-url"));
    }

    // Note: UserDTO doesn't have validation annotations, so validation test is skipped
    // If validation is added to UserDTO in the future, this test should be re-enabled
    // @Test
    // @DisplayName("PUT /api/user - Should return 400 when validation fails")
    // @WithMockUser(username = "testuser")
    // void testUpdateUser_ValidationError() throws Exception {
    //     UserDTO invalidDTO = UserDTO.builder()
    //             .bio("x".repeat(1001))
    //             .build();
    //
    //     mockMvc.perform(put("/api/user")
    //                     .with(csrf())
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(invalidDTO)))
    //             .andExpect(status().isBadRequest())
    //             .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(jsonPath("$.message").exists());
    // }

    @Test
    @DisplayName("GET /api/user/find/{id} - Should find users by skill successfully")
    @WithMockUser
    void testFindUsersBySkill_Success() throws Exception {
        UserDTO user1 = UserDTO.builder()
                .id(1L)
                .username("user1")
                .email("user1@example.com")
                .build();
        UserDTO user2 = UserDTO.builder()
                .id(2L)
                .username("user2")
                .email("user2@example.com")
                .build();
        List<UserDTO> users = Arrays.asList(user1, user2);

        PageResponse<UserDTO> pageResponse = PageResponse.<UserDTO>builder()
                .content(users)
                .totalElements(2L)
                .totalPages(1)
                .page(0)
                .size(20)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        when(userSearchService.findUserBySkill(eq(1L), any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/user/find/1")
                        .param("page", "0")
                        .param("size", "20")
                        .param("sortBy", "id")
                        .param("direction", "ASC"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2L))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(true))
                .andExpect(jsonPath("$.content[0].id").value(1L))
                .andExpect(jsonPath("$.content[0].username").value("user1"))
                .andExpect(jsonPath("$.content[1].id").value(2L))
                .andExpect(jsonPath("$.content[1].username").value("user2"));
    }

    @Test
    @DisplayName("GET /api/user/find/{id} - Should return 404 when no users found with skill")
    @WithMockUser
    void testFindUsersBySkill_NotFound() throws Exception {
        when(userSearchService.findUserBySkill(anyLong(), any(Pageable.class)))
                .thenThrow(new NoSuchElementFoundException("No users found with skill id: 999"));

        mockMvc.perform(get("/api/user/find/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value(containsString("No users found with skill id: 999")));
    }

    @Test
    @DisplayName("GET /api/user/find/{id} - Should use default pagination parameters")
    @WithMockUser
    void testFindUsersBySkill_DefaultPagination() throws Exception {
        PageResponse<UserDTO> pageResponse = PageResponse.<UserDTO>builder()
                .content(List.of())
                .totalElements(0L)
                .totalPages(0)
                .page(0)
                .size(20)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        when(userSearchService.findUserBySkill(eq(1L), any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/user/find/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20));
    }
}
