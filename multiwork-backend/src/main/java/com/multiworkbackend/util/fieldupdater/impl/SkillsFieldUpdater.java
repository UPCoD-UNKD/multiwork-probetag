package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for skills field.
 */
@Component
public class SkillsFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getSkills() != null) {
            project.setSkills(dto.getSkills());
        }
    }
    
    @Override
    public String getFieldName() {
        return "skills";
    }
}
