package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.entity.Link;
import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.entity.SocialMedia;
import com.multiworkbackend.entity.User;
import com.multiworkbackend.mapper.UserMapper;
import com.multiworkbackend.repo.UserRepo;
import com.multiworkbackend.services.LinkService;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.services.SocialMediaService;
import com.multiworkbackend.services.UserBasicFieldsService;
import com.multiworkbackend.services.UserCommandService;
import com.multiworkbackend.services.UserEntityService;
import com.multiworkbackend.util.skill.SkillLookupService;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * Implementation of UserCommandService for user write operations.
 * Follows CQRS pattern and best practices for command services.
 */
@Service
public class UserCommandServiceImpl implements UserCommandService {

    private static final Logger logger = LoggerFactory.getLogger(UserCommandServiceImpl.class);

    private final UserRepo userRepo;
    private final SkillService skillService;
    private final SkillLookupService skillLookupService;
    private final LinkService linkService;
    private final SocialMediaService socialMediaService;
    private final UserBasicFieldsService userBasicFieldsService;
    private final UserMapper userMapper;
    private final UserEntityService userEntityService;
    private final MeterRegistry meterRegistry;
    
    // Metrics
    private final Counter skillsUpdatedCounter;
    private final Counter skillsNotFoundCounter;
    private final Counter skillsFoundByIdCounter;
    private final Counter skillsFoundByNameCounter;
    
    // Constructor with metrics initialization
    public UserCommandServiceImpl(
            UserRepo userRepo,
            SkillService skillService,
            SkillLookupService skillLookupService,
            LinkService linkService,
            SocialMediaService socialMediaService,
            UserBasicFieldsService userBasicFieldsService,
            UserMapper userMapper,
            UserEntityService userEntityService,
            MeterRegistry meterRegistry) {
        this.userRepo = userRepo;
        this.skillService = skillService;
        this.skillLookupService = skillLookupService;
        this.linkService = linkService;
        this.socialMediaService = socialMediaService;
        this.userBasicFieldsService = userBasicFieldsService;
        this.userMapper = userMapper;
        this.userEntityService = userEntityService;
        this.meterRegistry = meterRegistry;
        
        // Initialize metrics
        this.skillsUpdatedCounter = Counter.builder("user.skills.updated")
                .description("Total number of user skills update operations")
                .register(meterRegistry);
        this.skillsNotFoundCounter = Counter.builder("user.skills.not_found")
                .description("Total number of skills not found during update")
                .tag("reason", "not_found")
                .register(meterRegistry);
        this.skillsFoundByIdCounter = Counter.builder("user.skills.found")
                .description("Total number of skills found by ID")
                .tag("method", "by_id")
                .register(meterRegistry);
        this.skillsFoundByNameCounter = Counter.builder("user.skills.found")
                .description("Total number of skills found by name")
                .tag("method", "by_name")
                .register(meterRegistry);
    }

    /**
     * Updates user information.
     * Only updates fields that are provided in the DTO, preserving existing data.
     *
     * @param userDTO user data to update
     * @param auth authentication context
     * @return updated UserDTO
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    @Transactional
    public UserDTO updateUser(UserDTO userDTO, Authentication auth) throws UsernameNotFoundException {
        User user = userEntityService.getUserByUsername(auth.getName());
        String originalPassword = user.getPassword();
         
        userBasicFieldsService.updateBasicFields(user, userDTO);
        
        if (userDTO.getSkills() != null) {
            updateSkills(user, userDTO.getSkills());
        }
         
        if (userDTO.getLinks() != null) {
            updateLinks(user, userDTO.getLinks());
        }
         
        if (userDTO.getSocialMediaSet() != null) {
            updateSocialMedia(user, userDTO.getSocialMediaSet());
        }
         
        user.setPassword(originalPassword);
        
        User savedUser = userRepo.save(user);
        return userMapper.toDTO(savedUser);
    }
    
    /**
     * Updates user skills from DTO.
     * Uses Strategy Pattern to find skills (by ID, then by name).
     * Skips invalid skills if not found by any strategy.
     * Tracks metrics for monitoring.
     *
     * @param user user entity to update
     * @param skillDTOs set of skill DTOs
     */
    private void updateSkills(User user, Set<Skill> skillDTOs) {
        skillsUpdatedCounter.increment();
        
        Set<Skill> skills = new HashSet<>();
        int foundCount = 0;
        int notFoundCount = 0;
        
        for (Skill skillDTO : skillDTOs) {
            Skill foundSkill = skillLookupService.findSkill(skillDTO, skillService);
            
            if (foundSkill != null) {
                skills.add(foundSkill);
                foundCount++;
                
                // Track which method was used (for metrics)
                // Check if found skill matches by ID (most reliable way)
                if (skillDTO.getId() != null && foundSkill.getId().equals(skillDTO.getId())) {
                    skillsFoundByIdCounter.increment();
                } else if (skillDTO.getName() != null && foundSkill.getName().equals(skillDTO.getName())) {
                    skillsFoundByNameCounter.increment();
                }
            } else {
                notFoundCount++;
                skillsNotFoundCounter.increment();
                logger.warn("Skipping skill (ID: {}, Name: {}) for user {} - not found in database", 
                        skillDTO.getId(), skillDTO.getName(), user.getId());
            }
        }
        
        // Log summary
        logger.info("Updated skills for user {}: {} found, {} not found", 
                user.getId(), foundCount, notFoundCount);
        
        user.setSkills(skills);
    }
    
    /**
     * Updates user links from DTO.
     * Delegates to LinkService to handle link creation/retrieval.
     *
     * @param user user entity to update
     * @param linkDTOs set of link DTOs
     */
    private void updateLinks(User user, Set<Link> linkDTOs) {
        Set<Link> processedLinks = linkService.processLinks(linkDTOs);
        user.setLinks(processedLinks);
    }
    
    /**
     * Updates user social media from DTO.
     * Delegates to SocialMediaService to handle social media creation/retrieval.
     *
     * @param user user entity to update
     * @param smDTOs set of social media DTOs
     */
    private void updateSocialMedia(User user, Set<SocialMedia> smDTOs) {
        Set<SocialMedia> processedSocialMedia = socialMediaService.processSocialMediaSet(smDTOs);
        user.setSocialMediaSet(processedSocialMedia);
    }
}
