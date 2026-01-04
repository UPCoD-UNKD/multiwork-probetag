package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.*;
import com.multiworkbackend.enums.Role;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.repo.LinkRepo;
import com.multiworkbackend.repo.SocialMediaRepo;
import com.multiworkbackend.repo.UserRepo;
import com.multiworkbackend.services.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private SkillService skillService;

    @Mock
    private LinkRepo linkRepo;

    @Mock
    private SocialMediaRepo socialMediaRepo;

    @Mock
    private UserEntityService userEntityService;

    @Mock
    private UserQueryService userQueryService;

    @Mock
    private UserProjectQueryService userProjectQueryService;

    @Mock
    private UserSearchService userSearchService;

    @Mock
    private UserCommandService userCommandService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private Skill skill;
    private Project project;

    @BeforeEach
    void setUp() {
        skill = new Skill(1L, "Java", null, null);

        user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .fullName("Test User")
                .password("encodedPassword")
                .role(Role.USER)
                .skills(new HashSet<>(Arrays.asList(skill)))
                .links(new HashSet<>())
                .socialMediaSet(new HashSet<>())
                .memberProjects(new HashSet<>())
                .build();

        project = Project.builder()
                .id(1L)
                .projectName("Test Project")
                .build();
    }

    @Test
    @DisplayName("Should get user by email successfully")
    void testGetUserByEmail_Success() {
        // Given
        when(userEntityService.getUserByEmail("test@example.com")).thenReturn(Optional.of(user));

        // When
        Optional<User> result = userService.getUserByEmail("test@example.com");

        // Then
        assertTrue(result.isPresent());
        assertEquals(user.getEmail(), result.get().getEmail());
        verify(userEntityService, times(1)).getUserByEmail("test@example.com");
    }

    @Test
    @DisplayName("Should return empty when user not found by email")
    void testGetUserByEmail_NotFound() {
        // Given
        when(userEntityService.getUserByEmail(anyString())).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUserByEmail("notfound@example.com");

        // Then
        assertFalse(result.isPresent());
        verify(userEntityService, times(1)).getUserByEmail("notfound@example.com");
    }

    @Test
    @DisplayName("Should get user by username successfully")
    void testGetUserByUsername_Success() throws UsernameNotFoundException {
        // Given
        when(userEntityService.getUserByUsername("testuser")).thenReturn(user);

        // When
        User result = userService.getUserByUsername("testuser");

        // Then
        assertNotNull(result);
        assertEquals(user.getUsername(), result.getUsername());
        verify(userEntityService, times(1)).getUserByUsername("testuser");
    }

    @Test
    @DisplayName("Should throw UsernameNotFoundException when user not found by username")
    void testGetUserByUsername_NotFound() {
        // Given
        when(userEntityService.getUserByUsername(anyString()))
                .thenThrow(new UsernameNotFoundException("User not found"));

        // When & Then
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.getUserByUsername("nonexistent");
        });

        verify(userEntityService, times(1)).getUserByUsername("nonexistent");
    }

    @Test
    @DisplayName("Should get user by id successfully")
    void testGetUserById_Success() throws NoSuchElementFoundException {
        // Given
        when(userEntityService.getUserById(1L)).thenReturn(user);

        // When
        User result = userService.getUserById(1L);

        // Then
        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        verify(userEntityService, times(1)).getUserById(1L);
    }

    @Test
    @DisplayName("Should throw NoSuchElementFoundException when user not found by id")
    void testGetUserById_NotFound() {
        // Given
        when(userEntityService.getUserById(anyLong()))
                .thenThrow(new NoSuchElementFoundException("User not found"));

        // When & Then
        assertThrows(NoSuchElementFoundException.class, () -> {
            userService.getUserById(999L);
        });

        verify(userEntityService, times(1)).getUserById(999L);
    }

    @Test
    @DisplayName("Should find user by id and return DTO successfully")
    void testFindUserById_Success() throws NoSuchElementFoundException {
        // Given
        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .build();
        when(userQueryService.findUserById(1L)).thenReturn(userDTO);

        // When
        UserDTO result = userService.findUserById(1L);

        // Then
        assertNotNull(result);
        assertEquals(userDTO.getId(), result.getId());
        verify(userQueryService, times(1)).findUserById(1L);
    }

    @Test
    @DisplayName("Should get current user successfully")
    void testGetCurrentUser_Success() throws UsernameNotFoundException {
        // Given
        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .build();
        when(userQueryService.getCurrentUser(authentication)).thenReturn(userDTO);

        // When
        UserDTO result = userService.getCurrentUser(authentication);

        // Then
        assertNotNull(result);
        assertEquals(userDTO.getUsername(), result.getUsername());
        verify(userQueryService, times(1)).getCurrentUser(authentication);
    }

    @Test
    @DisplayName("Should get current user projects successfully")
    void testGetCurrentUserProjects_Success() throws UsernameNotFoundException {
        // Given
        ProjectDTO projectDTO = ProjectDTO.builder()
                .id(1L)
                .projectName("Test Project")
                .build();
        when(userProjectQueryService.getCurrentUserProjects(authentication))
                .thenReturn(Arrays.asList(projectDTO));

        // When
        List<ProjectDTO> result = userService.getCurrentUserProjects(authentication);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(userProjectQueryService, times(1)).getCurrentUserProjects(authentication);
    }

    @Test
    @DisplayName("Should return empty list when user has no projects")
    void testGetCurrentUserProjects_Empty() throws UsernameNotFoundException {
        // Given
        when(userProjectQueryService.getCurrentUserProjects(authentication))
                .thenReturn(Collections.emptyList());

        // When
        List<ProjectDTO> result = userService.getCurrentUserProjects(authentication);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(userProjectQueryService, times(1)).getCurrentUserProjects(authentication);
    }

    @Test
    @DisplayName("Should update user successfully")
    void testUpdateUser_Success() throws UsernameNotFoundException {
        // Given
        UserDTO userDTO = UserDTO.builder()
                .fullName("Updated Name")
                .bio("Updated Bio")
                .avatar("avatar-url")
                .build();
        UserDTO updatedDTO = UserDTO.builder()
                .id(1L)
                .fullName("Updated Name")
                .build();
        when(userCommandService.updateUser(userDTO, authentication)).thenReturn(updatedDTO);

        // When
        UserDTO result = userService.updateUser(userDTO, authentication);

        // Then
        assertNotNull(result);
        verify(userCommandService, times(1)).updateUser(userDTO, authentication);
    }

    @Test
    @DisplayName("Should update user skills successfully")
    void testUpdateUser_WithSkills() throws UsernameNotFoundException, NoSuchElementFoundException {
        // Given
        Skill newSkill = new Skill(2L, "Python", null, null);
        UserDTO userDTO = UserDTO.builder()
                .skills(new HashSet<>(Arrays.asList(newSkill)))
                .build();
        UserDTO updatedDTO = UserDTO.builder()
                .id(1L)
                .skills(new HashSet<>(Arrays.asList(newSkill)))
                .build();
        when(userCommandService.updateUser(userDTO, authentication)).thenReturn(updatedDTO);

        // When
        UserDTO result = userService.updateUser(userDTO, authentication);

        // Then
        assertNotNull(result);
        verify(userCommandService, times(1)).updateUser(userDTO, authentication);
    }

    @Test
    @DisplayName("Should find users by skill successfully")
    void testFindUserBySkill_Success() throws NoSuchElementFoundException {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        UserDTO userDTO = UserDTO.builder()
                .id(1L)
                .username("testuser")
                .build();
        PageResponse<UserDTO> pageResponse = PageResponse.<UserDTO>builder()
                .content(Arrays.asList(userDTO))
                .page(0)
                .size(10)
                .totalElements(1L)
                .totalPages(1)
                .build();

        when(userSearchService.findUserBySkill(1L, pageable)).thenReturn(pageResponse);

        // When
        PageResponse<UserDTO> result = userService.findUserBySkill(1L, pageable);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(userSearchService, times(1)).findUserBySkill(1L, pageable);
    }

    @Test
    @DisplayName("Should throw NoSuchElementFoundException when no users found with skill")
    void testFindUserBySkill_NotFound() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        when(userSearchService.findUserBySkill(1L, pageable))
                .thenThrow(new NoSuchElementFoundException("No users found with skill id: 1"));

        // When & Then
        assertThrows(NoSuchElementFoundException.class, () -> {
            userService.findUserBySkill(1L, pageable);
        });

        verify(userSearchService, times(1)).findUserBySkill(1L, pageable);
    }
}
