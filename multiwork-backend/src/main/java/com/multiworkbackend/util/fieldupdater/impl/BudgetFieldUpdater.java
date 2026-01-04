package com.multiworkbackend.util.fieldupdater.impl;

import com.multiworkbackend.dto.ProjectDTO;
import com.multiworkbackend.entity.Project;
import com.multiworkbackend.util.fieldupdater.FieldUpdater;
import org.springframework.stereotype.Component;

/**
 * Field updater for budget field.
 */
@Component
public class BudgetFieldUpdater implements FieldUpdater {
    
    @Override
    public void update(Project project, ProjectDTO dto) {
        if (dto.getBudget() != null) {
            project.setBudget(dto.getBudget());
        }
    }
    
    @Override
    public String getFieldName() {
        return "budget";
    }
}
