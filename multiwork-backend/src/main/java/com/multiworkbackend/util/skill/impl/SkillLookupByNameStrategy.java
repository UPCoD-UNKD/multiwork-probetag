package com.multiworkbackend.util.skill.impl;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.util.skill.SkillLookupStrategy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Strategy for looking up skills by name.
 * Fallback strategy when ID lookup fails.
 */
@Slf4j
@Component
public class SkillLookupByNameStrategy implements SkillLookupStrategy {
    
    @Override
    public Skill findSkill(Skill skillDTO, SkillService skillService) {
        if (skillDTO.getName() == null || skillDTO.getName().trim().isEmpty()) {
            return null;
        }
        
        try {
            return skillService.findByName(skillDTO.getName());
        } catch (NoSuchElementFoundException e) {
            log.debug("Skill not found by name '{}': {}", skillDTO.getName(), e.getMessage());
            return null;
        }
    }
    
    @Override
    public int getPriority() {
        return 2; // Lower priority than ID lookup
    }
}
