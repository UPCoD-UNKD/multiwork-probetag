package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Field updater for projectPhoto field.
 */
@Component
public class ProjectPhotoFieldUpdater implements FieldUpdater {
    
    private static final Logger logger = LoggerFactory.getLogger(ProjectPhotoFieldUpdater.class);
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getProjectPhoto() != null) {
            if (dto.getProjectPhoto().length > 0) {
                // Verify array is not all zeros (which might indicate deserialization issue)
                boolean allZeros = true;
                for (int i = 0; i < Math.min(100, dto.getProjectPhoto().length); i++) {
                    if (dto.getProjectPhoto()[i] != 0) {
                        allZeros = false;
                        break;
                    }
                }
                if (allZeros && dto.getProjectPhoto().length > 100) {
                    logger.warn("ProjectPhoto array appears to be all zeros - possible deserialization issue!");
                }
                project.setProjectPhoto(dto.getProjectPhoto());
            } else {
                project.setProjectPhoto(null);
            }
        }
        // Keep existing photo if not provided in DTO
    }
    
    @Override
    public String getFieldName() {
        return "projectPhoto";
    }
}
