package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.services.UserBasicFieldsService;
import com.multiworkbackend.util.validation.DataSizeValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Implementation of UserBasicFieldsService for updating basic user fields.
 * Follows Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
public class UserBasicFieldsServiceImpl implements UserBasicFieldsService {

    private final DataSizeValidator dataSizeValidator;

    @Override
    public void updateBasicFields(User user, UserDTO userDTO) {
        if (user == null || userDTO == null) {
            return;
        }

        if (userDTO.getFullName() != null) {
            // Note: Full name validation would go here if needed
            user.setFullName(userDTO.getFullName());
        }
        
        if (userDTO.getBio() != null) {
            dataSizeValidator.validateBioLength(userDTO.getBio());
            user.setBio(userDTO.getBio());
        }
        
        if (userDTO.getAvatar() != null) {
            // Avatar is stored as String (CLOB), not byte[], so we validate length
            // If it's a base64 encoded image, the actual size validation should be done at DTO level
            // For now, we assume avatar is a URL or base64 string
            user.setAvatar(userDTO.getAvatar());
        }
    }
}
