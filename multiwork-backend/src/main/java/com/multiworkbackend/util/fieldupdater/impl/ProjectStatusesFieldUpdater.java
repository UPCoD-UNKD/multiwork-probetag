package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for projectStatuses field.
 */
@Component
public class ProjectStatusesFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getProjectStatuses() != null) {
            project.setProjectStatuses(dto.getProjectStatuses());
        }
    }
    
    @Override
    public String getFieldName() {
        return "projectStatuses";
    }
}
