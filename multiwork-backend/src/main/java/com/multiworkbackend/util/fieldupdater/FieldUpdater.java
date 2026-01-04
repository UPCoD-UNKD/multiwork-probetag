package com.multiworkbackend.util.fieldupdater;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;

/**
 * Interface for updating a specific field in Project entity from ProjectDTO.
 * Follows Open/Closed Principle - new field updaters can be added without modifying existing code.
 */
public interface FieldUpdater {
    
    /**
     * Updates the field in the project entity if the value is present in the DTO.
     * 
     * @param project project entity to update
     * @param dto DTO containing new values
     */
    void update(Project project, ProjectDTO dto);
    
    /**
     * Returns the name of the field this updater handles.
     * 
     * @return field name
     */
    String getFieldName();
}
