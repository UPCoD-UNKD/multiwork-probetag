package com.multiworkbackend.util.validation;

import com.multiworkbackend.util.DataSizeConstants;
import org.springframework.stereotype.Component;

/**
 * Validator for data size constraints.
 * Provides validation methods for various data types to prevent memory issues and abuse.
 */
@Component
public class DataSizeValidator {
    
    /**
     * Validates project photo size.
     * 
     * @param photo photo data as byte array
     * @throws IllegalArgumentException if photo exceeds maximum size
     */
    public void validateProjectPhotoSize(byte[] photo) {
        if (photo == null) {
            return; // Null is allowed (optional field)
        }
        
        if (photo.length > DataSizeConstants.MAX_PROJECT_PHOTO_SIZE) {
            long sizeMB = DataSizeConstants.MAX_PROJECT_PHOTO_SIZE / (1024 * 1024);
            throw new IllegalArgumentException(
                String.format("Project photo size (%d bytes) exceeds maximum allowed size (%d MB)", 
                    photo.length, sizeMB)
            );
        }
    }
    
    /**
     * Validates avatar size.
     * 
     * @param avatar avatar data as byte array
     * @throws IllegalArgumentException if avatar exceeds maximum size
     */
    public void validateAvatarSize(byte[] avatar) {
        if (avatar == null) {
            return; // Null is allowed (optional field)
        }
        
        if (avatar.length > DataSizeConstants.MAX_AVATAR_SIZE) {
            long sizeMB = DataSizeConstants.MAX_AVATAR_SIZE / (1024 * 1024);
            throw new IllegalArgumentException(
                String.format("Avatar size (%d bytes) exceeds maximum allowed size (%d MB)", 
                    avatar.length, sizeMB)
            );
        }
    }
    
    /**
     * Validates description length.
     * 
     * @param description description text
     * @param fieldName name of the field for error message
     * @throws IllegalArgumentException if description exceeds maximum length
     */
    public void validateDescriptionLength(String description, String fieldName) {
        if (description == null) {
            return; // Null is allowed (optional field)
        }
        
        if (description.length() > DataSizeConstants.MAX_DESCRIPTION_LENGTH) {
            throw new IllegalArgumentException(
                String.format("%s length (%d characters) exceeds maximum allowed length (%d characters)", 
                    fieldName, description.length(), DataSizeConstants.MAX_DESCRIPTION_LENGTH)
            );
        }
    }
    
    /**
     * Validates comment text length.
     * 
     * @param text comment text
     * @throws IllegalArgumentException if text exceeds maximum length
     */
    public void validateCommentTextLength(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be null or empty");
        }
        
        if (text.length() > DataSizeConstants.MAX_COMMENT_TEXT_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Comment text length (%d characters) exceeds maximum allowed length (%d characters)", 
                    text.length(), DataSizeConstants.MAX_COMMENT_TEXT_LENGTH)
            );
        }
    }
    
    /**
     * Validates bio length.
     * 
     * @param bio bio text
     * @throws IllegalArgumentException if bio exceeds maximum length
     */
    public void validateBioLength(String bio) {
        if (bio == null) {
            return; // Null is allowed (optional field)
        }
        
        if (bio.length() > DataSizeConstants.MAX_BIO_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Bio length (%d characters) exceeds maximum allowed length (%d characters)", 
                    bio.length(), DataSizeConstants.MAX_BIO_LENGTH)
            );
        }
    }
    
    /**
     * Validates project name length.
     * 
     * @param projectName project name
     * @throws IllegalArgumentException if project name exceeds maximum length
     */
    public void validateProjectNameLength(String projectName) {
        if (projectName == null || projectName.trim().isEmpty()) {
            throw new IllegalArgumentException("Project name cannot be null or empty");
        }
        
        if (projectName.length() > DataSizeConstants.MAX_PROJECT_NAME_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Project name length (%d characters) exceeds maximum allowed length (%d characters)", 
                    projectName.length(), DataSizeConstants.MAX_PROJECT_NAME_LENGTH)
            );
        }
    }
}
