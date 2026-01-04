package com.multiworkbackend.util;

/**
 * Constants for Project-related operations.
 * Centralizes magic numbers and configuration values.
 * 
 * Note: For data size constants, see DataSizeConstants.
 */
public final class ProjectConstants {
    
    private ProjectConstants() {
        // Utility class - prevent instantiation
    }
    
    /**
     * Default budget value for new projects.
     */
    public static final int DEFAULT_BUDGET = 0;
    
    /**
     * Default position increment for new projects.
     */
    public static final long DEFAULT_POSITION_INCREMENT = 1L;
    
    /**
     * Maximum length for project name.
     * @deprecated Use DataSizeConstants.MAX_PROJECT_NAME_LENGTH instead
     */
    @Deprecated
    public static final int MAX_PROJECT_NAME_LENGTH = com.multiworkbackend.util.DataSizeConstants.MAX_PROJECT_NAME_LENGTH;
    
    /**
     * Maximum length for project description.
     * @deprecated Use DataSizeConstants.MAX_DESCRIPTION_LENGTH instead
     */
    @Deprecated
    public static final int MAX_DESCRIPTION_LENGTH = com.multiworkbackend.util.DataSizeConstants.MAX_DESCRIPTION_LENGTH;
    
    /**
     * Maximum number of team members per project.
     */
    public static final int MAX_TEAM_MEMBERS = 50;
    
    /**
     * Multiplier for fetching similar projects (to ensure proper sorting).
     * Used when calculating similarity requires loading more projects than requested.
     */
    public static final int MAX_SIMILAR_PROJECTS_FETCH_MULTIPLIER = 10;
    
    /**
     * Minimum number of projects to fetch when calculating similarity.
     * Ensures enough data for accurate similarity calculation.
     */
    public static final int MIN_SIMILAR_PROJECTS_FETCH_SIZE = 1000;
    
    /**
     * Maximum number of projects to fetch when calculating similarity.
     * Prevents memory issues with large datasets.
     */
    public static final int MAX_SIMILAR_PROJECTS_FETCH_SIZE = 5000;
}
