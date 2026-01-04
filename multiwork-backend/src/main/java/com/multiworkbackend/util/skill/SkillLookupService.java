package com.multiworkbackend.util.skill;

import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.services.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

/**
 * Service that uses Strategy Pattern to find skills.
 * Tries multiple lookup strategies in priority order.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SkillLookupService {
    
    private final List<SkillLookupStrategy> strategies;
    
    /**
     * Attempts to find a skill using all available strategies in priority order.
     * 
     * @param skillDTO the skill DTO containing search criteria
     * @param skillService the skill service to use for lookup
     * @return found Skill or null if not found by any strategy
     */
    public Skill findSkill(Skill skillDTO, SkillService skillService) {
        // Sort strategies by priority
        List<SkillLookupStrategy> sortedStrategies = strategies.stream()
                .sorted(Comparator.comparingInt(SkillLookupStrategy::getPriority))
                .toList();
        
        // Try each strategy in order
        for (SkillLookupStrategy strategy : sortedStrategies) {
            Skill foundSkill = strategy.findSkill(skillDTO, skillService);
            if (foundSkill != null) {
                log.debug("Skill found using strategy: {}", strategy.getClass().getSimpleName());
                return foundSkill;
            }
        }
        
        return null;
    }
}
