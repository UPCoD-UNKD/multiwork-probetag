package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.dto.UserDTO;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for searching users by various criteria.
 * Follows Interface Segregation Principle by separating search operations from basic queries.
 */
public interface UserSearchService {
    
    /**
     * Finds users by skill ID with pagination.
     *
     * @param skillId skill ID
     * @param pageable pagination parameters
     * @return PageResponse containing paginated users
     * @throws NoSuchElementFoundException if skill not found or no users found
     */
    PageResponse<UserDTO> findUserBySkill(Long skillId, Pageable pageable) throws NoSuchElementFoundException;
}
