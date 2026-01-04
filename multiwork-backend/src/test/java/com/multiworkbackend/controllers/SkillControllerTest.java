package com.multiworkbackend.controllers;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.services.SkillService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("SkillController API Tests")
class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SkillService skillService;

    @Test
    @DisplayName("GET /api/skill/ - Should return all skills without pagination")
    @WithMockUser
    void testGetAllSkills_WithoutPagination() throws Exception {
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");

        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring");

        List<Skill> skills = Arrays.asList(skill1, skill2);

        when(skillService.findAll()).thenReturn(skills);

        mockMvc.perform(get("/api/skill/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].name").value("Java"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].name").value("Spring"));
    }

    @Test
    @DisplayName("GET /api/skill/ - Should return paginated skills when pagination params provided")
    @WithMockUser
    void testGetAllSkills_WithPagination() throws Exception {
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");

        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring");

        PageResponse<Skill> pageResponse = PageResponse.<Skill>builder()
                .content(Arrays.asList(skill1, skill2))
                .totalElements(2L)
                .totalPages(1)
                .page(0)
                .size(10)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        when(skillService.findAll(any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/skill/")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2L))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10));
    }

    @Test
    @DisplayName("GET /api/skill/ - Should return empty list when no skills exist")
    @WithMockUser
    void testGetAllSkills_Empty() throws Exception {
        when(skillService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/skill/"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    @DisplayName("GET /api/skill/ - Should use default sort parameters")
    @WithMockUser
    void testGetAllSkills_DefaultSort() throws Exception {
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");

        when(skillService.findAll()).thenReturn(List.of(skill1));

        mockMvc.perform(get("/api/skill/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("GET /api/skill/ - Should use custom sort parameters")
    @WithMockUser
    void testGetAllSkills_DescSort() throws Exception {
        Skill skill1 = new Skill();
        skill1.setId(1L);
        skill1.setName("Java");

        Skill skill2 = new Skill();
        skill2.setId(2L);
        skill2.setName("Spring");

        PageResponse<Skill> pageResponse = PageResponse.<Skill>builder()
                .content(Arrays.asList(skill2, skill1))
                .totalElements(2L)
                .totalPages(1)
                .page(0)
                .size(10)
                .first(true)
                .last(true)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        when(skillService.findAll(any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/skill/")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortBy", "name")
                        .param("direction", "DESC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Spring"))
                .andExpect(jsonPath("$.content[1].name").value("Java"));
    }
}
