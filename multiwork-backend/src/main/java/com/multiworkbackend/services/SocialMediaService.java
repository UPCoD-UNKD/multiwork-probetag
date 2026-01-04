package com.multiworkbackend.services;

import com.multiworkbackend.entity.SocialMedia;

import java.util.Set;

/**
 * Service interface for SocialMedia entity operations.
 * Follows Single Responsibility Principle by focusing solely on social media management.
 */
public interface SocialMediaService {
    
    /**
     * Creates or retrieves a social media entry.
     * If social media has ID, retrieves existing entry from database.
     * If social media doesn't have ID but has reference, creates new entry.
     *
     * @param socialMedia social media entity (may have ID or reference)
     * @return created or existing social media entry
     */
    SocialMedia createOrGetSocialMedia(SocialMedia socialMedia);
    
    /**
     * Processes a set of social media entries, creating new ones or retrieving existing ones.
     *
     * @param socialMediaSet set of social media entries to process
     * @return set of processed social media entries (created or retrieved)
     */
    Set<SocialMedia> processSocialMediaSet(Set<SocialMedia> socialMediaSet);
}
