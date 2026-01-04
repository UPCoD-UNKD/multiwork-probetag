package com.multiworkbackend.services.impl;

import com.multiworkbackend.entity.Link;
import com.multiworkbackend.repo.LinkRepo;
import com.multiworkbackend.services.LinkService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * Implementation of LinkService for link management operations.
 * Follows Single Responsibility Principle.
 */
@Service
@RequiredArgsConstructor
public class LinkServiceImpl implements LinkService {

    private static final Logger logger = LoggerFactory.getLogger(LinkServiceImpl.class);

    private final LinkRepo linkRepo;

    @Override
    @Transactional
    public Link createOrGetLink(Link link) {
        if (link == null) {
            return null;
        }

        // If link has ID, retrieve existing link
        if (link.getId() != null) {
            return linkRepo.findById(link.getId())
                    .orElse(null);
        }

        // If link has title and reference, create new link
        if (link.getTitle() != null && link.getReference() != null) {
            Link newLink = new Link();
            newLink.setTitle(link.getTitle());
            newLink.setReference(link.getReference());
            Link savedLink = linkRepo.save(newLink);
            return savedLink;
        }

        return null;
    }

    @Override
    @Transactional
    public Set<Link> processLinks(Set<Link> links) {
        if (links == null || links.isEmpty()) {
            return new HashSet<>();
        }

        Set<Link> processedLinks = new HashSet<>();
        for (Link link : links) {
            Link processedLink = createOrGetLink(link);
            if (processedLink != null) {
                processedLinks.add(processedLink);
            } else {
                logger.warn("Skipping invalid link: {}", link);
            }
        }

        return processedLinks;
    }
}
