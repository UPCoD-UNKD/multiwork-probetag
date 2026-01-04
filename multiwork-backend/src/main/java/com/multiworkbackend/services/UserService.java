package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserByUsernameOptional(String username);
    User getUserByUsername(String username) throws UsernameNotFoundException;

    User getUserById(Long id) throws NoSuchElementFoundException;

    UserDTO findUserById(Long id) throws NoSuchElementFoundException;

    UserDTO getCurrentUser(Authentication auth) throws UsernameNotFoundException;

    List<ProjectDTO> getCurrentUserProjects(Authentication auth) throws UsernameNotFoundException;

    UserDTO updateUser(UserDTO userDTO, Authentication auth) throws UsernameNotFoundException;
    
    PageResponse<UserDTO> findUserBySkill(Long id, org.springframework.data.domain.Pageable pageable) throws NoSuchElementFoundException;
}
