package com.multiworkbackend.services.impl;

import com.multiworkbackend.entity.SocialMedia;
import com.multiworkbackend.repo.SocialMediaRepo;
import com.multiworkbackend.services.SocialMediaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * Implementation of SocialMediaService for social media management operations.
 * Follows Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
public class SocialMediaServiceImpl implements SocialMediaService {

    private static final Logger logger = LoggerFactory.getLogger(SocialMediaServiceImpl.class);

    private final SocialMediaRepo socialMediaRepo;

    @Override
    @Transactional
    public SocialMedia createOrGetSocialMedia(SocialMedia socialMedia) {
        if (socialMedia == null) {
            return null;
        }

        // If social media has ID, retrieve existing entry
        if (socialMedia.getId() != null) {
            return socialMediaRepo.findById(socialMedia.getId())
                    .orElse(null);
        }

        // If social media has reference, create new entry
        if (socialMedia.getReferenceSocialMedia() != null && 
            !socialMedia.getReferenceSocialMedia().isEmpty()) {
            SocialMedia newSM = new SocialMedia();
            newSM.setReferenceSocialMedia(socialMedia.getReferenceSocialMedia());
            SocialMedia savedSM = socialMediaRepo.save(newSM);
            return savedSM;
        }

        return null;
    }

    @Override
    @Transactional
    public Set<SocialMedia> processSocialMediaSet(Set<SocialMedia> socialMediaSet) {
        if (socialMediaSet == null || socialMediaSet.isEmpty()) {
            return new HashSet<>();
        }

        Set<SocialMedia> processedSet = new HashSet<>();
        for (SocialMedia sm : socialMediaSet) {
            SocialMedia processedSM = createOrGetSocialMedia(sm);
            if (processedSM != null) {
                processedSet.add(processedSM);
            } else {
                logger.warn("Skipping invalid social media entry: {}", sm);
            }
        }

        return processedSet;
    }
}
