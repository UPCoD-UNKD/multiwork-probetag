package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for projectName field.
 */
@Component
public class ProjectNameFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getProjectName() != null) {
            project.setProjectName(dto.getProjectName());
        }
    }
    
    @Override
    public String getFieldName() {
        return "projectName";
    }
}
