package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for preferredTeamSize field.
 */
@Component
public class PreferredTeamSizeFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getPreferredTeamSize() != null) {
            project.setPreferredTeamSize(dto.getPreferredTeamSize());
        }
    }
    
    @Override
    public String getFieldName() {
        return "preferredTeamSize";
    }
}
