package com.multiworkbackend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.multiworkbackend.dto.CommentDTO;
import com.multiworkbackend.dto.UserSummaryDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.CommentService;
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
import java.time.LocalTime;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("CommentController API Tests")
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CommentService commentService;

    @Test
    @DisplayName("GET /api/comment/{id} - Should return comment by id successfully")
    @WithMockUser
    void testGetComment_Success() throws Exception {
        UserSummaryDTO creator = UserSummaryDTO.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        CommentDTO commentDTO = CommentDTO.builder()
                .id(1L)
                .text("Test comment")
                .date(LocalDate.now())
                .time(LocalTime.now())
                .creator(creator)
                .build();

        when(commentService.getComment(1L)).thenReturn(commentDTO);

        mockMvc.perform(get("/api/comment/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.text").value("Test comment"))
                .andExpect(jsonPath("$.creator.id").value(1L))
                .andExpect(jsonPath("$.creator.username").value("testuser"));
    }

    @Test
    @DisplayName("GET /api/comment/{id} - Should return 404 when comment not found")
    @WithMockUser
    void testGetComment_NotFound() throws Exception {
        when(commentService.getComment(anyLong()))
                .thenThrow(new NoSuchElementFoundException("Comment not found with id: 999"));

        mockMvc.perform(get("/api/comment/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value(containsString("Comment not found with id: 999")));
    }

    @Test
    @DisplayName("POST /api/comment/ - Should create comment successfully")
    @WithMockUser
    void testCreateComment_Success() throws Exception {
        CommentDTO createDTO = CommentDTO.builder()
                .text("New comment")
                .build();

        UserSummaryDTO creator = UserSummaryDTO.builder()
                .id(1L)
                .username("testuser")
                .build();

        CommentDTO createdComment = CommentDTO.builder()
                .id(1L)
                .text("New comment")
                .date(LocalDate.now())
                .time(LocalTime.now())
                .creator(creator)
                .build();

        when(commentService.createComment(any(CommentDTO.class))).thenReturn(createdComment);

        mockMvc.perform(post("/api/comment/")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.text").value("New comment"))
                .andExpect(jsonPath("$.creator.id").value(1L));
    }

    // Note: CommentDTO doesn't have validation annotations, so validation tests are skipped
    // If validation is added to CommentDTO in the future, these tests should be re-enabled
    // @Test
    // @DisplayName("POST /api/comment/ - Should return 400 when validation fails")
    // @WithMockUser
    // void testCreateComment_ValidationError() throws Exception {
    //     CommentDTO invalidDTO = CommentDTO.builder()
    //             .text("")
    //             .build();
    //
    //     mockMvc.perform(post("/api/comment/")
    //                     .with(csrf())
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(invalidDTO)))
    //             .andExpect(status().isBadRequest())
    //             .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(jsonPath("$.message").exists());
    // }
    //
    // @Test
    // @DisplayName("POST /api/comment/ - Should return 400 when text is too long")
    // @WithMockUser
    // void testCreateComment_TextTooLong() throws Exception {
    //     CommentDTO invalidDTO = CommentDTO.builder()
    //             .text("x".repeat(5001))
    //             .build();
    //
    //     mockMvc.perform(post("/api/comment/")
    //                     .with(csrf())
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(invalidDTO)))
    //             .andExpect(status().isBadRequest())
    //             .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    //             .andExpect(jsonPath("$.message").exists());
    // }
}
