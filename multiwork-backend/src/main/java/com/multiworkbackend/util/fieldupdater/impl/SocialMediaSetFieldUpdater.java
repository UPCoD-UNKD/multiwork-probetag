package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for socialMediaSet field.
 */
@Component
public class SocialMediaSetFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getSocialMediaSet() != null) {
            project.setSocialMediaSet(dto.getSocialMediaSet());
        }
    }
    
    @Override
    public String getFieldName() {
        return "socialMediaSet";
    }
}
