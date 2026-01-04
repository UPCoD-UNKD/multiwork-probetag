package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for description field.
 */
@Component
public class DescriptionFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getDescription() != null) {
            project.setDescription(dto.getDescription());
        }
    }
    
    @Override
    public String getFieldName() {
        return "description";
    }
}
