package com.multiworkbackend.repo;

import com.multiworkbackend.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;



@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"comments", "comments.creator", "creator", "members", "followers", "skills", "socialMediaSet", "projectStatuses", "projectTypes"})
    @NonNull
    Optional<Project> findById(@NonNull Long id);
    
    @EntityGraph(attributePaths = {"comments", "comments.creator", "creator", "members", "followers", "skills", "socialMediaSet", "projectStatuses", "projectTypes"})
    @Query("SELECT p FROM Project p")
    List<Project> findAllWithDetails();
    
    @EntityGraph(attributePaths = {"comments", "comments.creator", "creator", "members", "followers", "skills", "socialMediaSet", "projectStatuses", "projectTypes"})
    @Query("SELECT p FROM Project p")
    Page<Project> findAllWithDetails(Pageable pageable);
    
    @EntityGraph(attributePaths = {"comments", "comments.creator", "creator", "members", "followers", "skills", "socialMediaSet", "projectStatuses", "projectTypes"})
    @Query("SELECT p FROM Project p WHERE :skillId IN (SELECT s.id FROM p.skills s)")
    Page<Project> findAllBySkillId(Long skillId, Pageable pageable);
    
    /**
     * Finds projects that have at least one common skill with target projects.
     * This is an optimized query that filters projects at database level.
     * Similarity calculation is done in service layer for better portability.
     * 
     * @param excludedIds project IDs to exclude from results
     * @param targetIds project IDs to compare against
     * @param pageable pagination parameters
     * @return page of projects that have common skills with target projects
     */
    @EntityGraph(attributePaths = {"comments", "comments.creator", "creator", "members", "followers", "skills", "socialMediaSet", "projectStatuses", "projectTypes"})
    @Query("""
        SELECT DISTINCT p FROM Project p
        JOIN p.skills s
        WHERE p.id NOT IN :excludedIds
          AND s.id IN (
              SELECT DISTINCT s2.id FROM Project p2
              JOIN p2.skills s2
              WHERE p2.id IN :targetIds
          )
        """)
    Page<Project> findProjectsWithCommonSkills(
        @Param("excludedIds") List<Long> excludedIds,
        @Param("targetIds") List<Long> targetIds,
        Pageable pageable
    );
    
    /**
     * Gets the maximum position value from all projects.
     * Used for calculating next position when creating new projects.
     * 
     * @return maximum position, or 0L if no projects exist
     */
    @Query("SELECT COALESCE(MAX(p.position), 0L) FROM Project p")
    Long getMaxPosition();
}

