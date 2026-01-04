package com.multiworkbackend.util.skill.impl;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.util.skill.SkillLookupStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Strategy for looking up skills by ID.
 * Highest priority strategy.
 */
@Slf4j
@Component
public class SkillLookupByIdStrategy implements SkillLookupStrategy {
    
    @Override
    public Skill findSkill(Skill skillDTO, SkillService skillService) {
        if (skillDTO.getId() == null) {
            return null;
        }
        
        try {
            return skillService.findById(skillDTO.getId());
        } catch (NoSuchElementFoundException e) {
            log.debug("Skill not found by ID {}: {}", skillDTO.getId(), e.getMessage());
            return null;
        }
    }
    
    @Override
    public int getPriority() {
        return 1; // Highest priority
    }
}
