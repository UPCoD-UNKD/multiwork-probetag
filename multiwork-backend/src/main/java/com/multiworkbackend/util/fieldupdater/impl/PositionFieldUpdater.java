package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for position field.
 */
@Component
public class PositionFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getPosition() != null) {
            project.setPosition(dto.getPosition());
        }
    }
    
    @Override
    public String getFieldName() {
        return "position";
    }
}
