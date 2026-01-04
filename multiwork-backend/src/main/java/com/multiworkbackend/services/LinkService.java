package com.multiworkbackend.services;

import com.multiworkbackend.entity.Link;

import java.util.Set;

/**
 * Service interface for Link entity operations.
 * Follows Single Responsibility Principle by focusing solely on link management.
 */
public interface LinkService {
    
    /**
     * Creates or retrieves a link.
     * If link has ID, retrieves existing link from database.
     * If link doesn't have ID but has title and reference, creates new link.
     *
     * @param link link entity (may have ID or title+reference)
     * @return created or existing link
     */
    Link createOrGetLink(Link link);
    
    /**
     * Processes a set of links, creating new ones or retrieving existing ones.
     *
     * @param links set of links to process
     * @return set of processed links (created or retrieved)
     */
    Set<Link> processLinks(Set<Link> links);
}
