package com.multiworkbackend.services;

import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.User;

/**
 * Service interface for updating basic user fields (name, bio, avatar).
 * Follows Single Responsibility Principle by focusing solely on basic field updates.
 */
public interface UserBasicFieldsService {
    
    /**
     * Updates basic user fields (fullName, bio, avatar) from DTO.
     * Validates data sizes before updating.
     *
     * @param user user entity to update
     * @param userDTO DTO containing new values
     */
    void updateBasicFields(User user, UserDTO userDTO);
}
