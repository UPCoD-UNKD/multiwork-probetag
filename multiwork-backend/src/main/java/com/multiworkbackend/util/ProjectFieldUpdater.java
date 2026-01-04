package com.multiworkbackend.util;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Utility class for updating Project entity fields from ProjectDTO.
 * Uses Strategy pattern with FieldUpdater implementations to follow Open/Closed Principle.
 * New fields can be added by creating a new FieldUpdater implementation without modifying this class.
 * 
 * This class follows Single Responsibility Principle by focusing solely on
 * coordinating field updates through registered updaters.
 */
@Component
public class ProjectFieldUpdater {

    /**
     * List of field updaters, automatically injected by Spring.
     * Each updater handles a specific field update logic.
     */
    private final List<FieldUpdater> fieldUpdaters;

    /**
     * Constructor with dependency injection.
     * Spring will automatically inject all FieldUpdater implementations.
     * 
     * @param fieldUpdaters list of all FieldUpdater bean implementations
     */
    public ProjectFieldUpdater(List<FieldUpdater> fieldUpdaters) {
        this.fieldUpdaters = fieldUpdaters;
    }

    /**
     * Updates project entity fields from DTO.
     * Only updates fields that are provided (non-null) in the DTO.
     * Uses all registered FieldUpdater implementations to update respective fields.
     * 
     * @param project project entity to update
     * @param dto DTO containing new values
     */
    public void updateFields(Project project, ProjectDTO dto) {
        if (project == null || dto == null) {
            return;
        }

        // Apply all registered field updaters
        // Each updater checks if its field is present in DTO and updates accordingly
        fieldUpdaters.forEach(updater -> updater.update(project, dto));
    }

    /**
     * Gets the list of registered field updaters (for testing or extension purposes).
     * 
     * @return list of field updaters
     */
    public List<FieldUpdater> getFieldUpdaters() {
        return List.copyOf(fieldUpdaters);
    }
}
