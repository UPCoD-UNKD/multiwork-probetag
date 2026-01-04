package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for date field.
 */
@Component
public class DateFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getDate() != null) {
            project.setDate(dto.getDate());
        }
    }
    
    @Override
    public String getFieldName() {
        return "date";
    }
}
