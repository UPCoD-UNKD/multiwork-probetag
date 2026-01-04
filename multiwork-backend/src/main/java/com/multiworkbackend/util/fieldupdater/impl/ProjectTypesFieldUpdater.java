package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for projectTypes field.
 */
@Component
public class ProjectTypesFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getProjectTypes() != null) {
            project.setProjectTypes(dto.getProjectTypes());
        }
    }
    
    @Override
    public String getFieldName() {
        return "projectTypes";
    }
}
