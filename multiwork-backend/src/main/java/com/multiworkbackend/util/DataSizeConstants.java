package com.multiworkbackend.util;

/**
 * Constants for data size limits.
 * Centralizes maximum size values for various data types to prevent memory issues and abuse.
 */
public final class DataSizeConstants {
    
    private DataSizeConstants() {
        // Utility class - prevent instantiation
    }
    
    /**
     * Maximum size for project photo in bytes (10 MB).
     */
    public static final long MAX_PROJECT_PHOTO_SIZE = 10 * 1024 * 1024; // 10 MB
    
    /**
     * Maximum size for user avatar in bytes (5 MB).
     */
    public static final long MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5 MB
    
    /**
     * Maximum length for project description in characters.
     */
    public static final int MAX_DESCRIPTION_LENGTH = 5000;
    
    /**
     * Maximum length for comment text in characters.
     */
    public static final int MAX_COMMENT_TEXT_LENGTH = 2000;
    
    /**
     * Maximum length for user bio in characters.
     */
    public static final int MAX_BIO_LENGTH = 1000;
    
    /**
     * Maximum length for project name in characters.
     */
    public static final int MAX_PROJECT_NAME_LENGTH = 100;
    
    /**
     * Maximum length for username in characters.
     */
    public static final int MAX_USERNAME_LENGTH = 50;
    
    /**
     * Maximum length for full name in characters.
     */
    public static final int MAX_FULL_NAME_LENGTH = 100;
}
