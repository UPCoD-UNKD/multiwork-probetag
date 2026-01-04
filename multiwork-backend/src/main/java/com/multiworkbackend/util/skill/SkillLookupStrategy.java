package com.multiworkbackend.util.skill;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.services.SkillService;

/**
 * Strategy interface for looking up skills.
 * Follows Strategy Pattern to allow different lookup strategies.
 */
public interface SkillLookupStrategy {
    
    /**
     * Attempts to find a skill using this strategy.
     * 
     * @param skillDTO the skill DTO containing search criteria
     * @param skillService the skill service to use for lookup
     * @return found Skill or null if not found
     */
    Skill findSkill(Skill skillDTO, SkillService skillService);
    
    /**
     * Returns the priority of this strategy (lower number = higher priority).
     * 
     * @return priority value
     */
    int getPriority();
}
