package com.multiworkbackend.repo;

import com.multiworkbackend.entity.ProjectApplication;
import com.multiworkbackend.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for ProjectApplication entity.
 * Follows repository pattern for data access abstraction.
 */
@Repository
public interface ProjectApplicationRepository extends JpaRepository<ProjectApplication, Long> {
    
    /**
     * Finds application by project and applicant with eager loading.
     * 
     * @param projectId project ID
     * @param applicantId applicant user ID
     * @return Optional ProjectApplication
     */
    @EntityGraph(attributePaths = {"project", "applicant", "reviewedBy"})
    @Query("SELECT a FROM ProjectApplication a WHERE a.project.id = :projectId AND a.applicant.id = :applicantId")
    Optional<ProjectApplication> findByProjectIdAndApplicantId(
        @Param("projectId") Long projectId,
        @Param("applicantId") Long applicantId
    );
    
    /**
     * Finds all applications for a project with pagination.
     * 
     * @param projectId project ID
     * @param pageable pagination parameters
     * @return Page of ProjectApplication
     */
    @EntityGraph(attributePaths = {"project", "applicant", "reviewedBy"})
    @Query("SELECT a FROM ProjectApplication a WHERE a.project.id = :projectId ORDER BY a.createdAt DESC")
    Page<ProjectApplication> findByProjectId(@Param("projectId") Long projectId, Pageable pageable);
    
    /**
     * Finds all applications for a project by status with pagination.
     * 
     * @param projectId project ID
     * @param status application status
     * @param pageable pagination parameters
     * @return Page of ProjectApplication
     */
    @EntityGraph(attributePaths = {"project", "applicant", "reviewedBy"})
    @Query("SELECT a FROM ProjectApplication a WHERE a.project.id = :projectId AND a.status = :status ORDER BY a.createdAt DESC")
    Page<ProjectApplication> findByProjectIdAndStatus(
        @Param("projectId") Long projectId,
        @Param("status") ApplicationStatus status,
        Pageable pageable
    );
    
    /**
     * Finds all applications by a user (applicant) with pagination.
     * 
     * @param applicantId applicant user ID
     * @param pageable pagination parameters
     * @return Page of ProjectApplication
     */
    @EntityGraph(attributePaths = {"project", "applicant", "reviewedBy"})
    @Query("SELECT a FROM ProjectApplication a WHERE a.applicant.id = :applicantId ORDER BY a.createdAt DESC")
    Page<ProjectApplication> findByApplicantId(@Param("applicantId") Long applicantId, Pageable pageable);
    
    /**
     * Finds all applications by a user with specific status.
     * 
     * @param applicantId applicant user ID
     * @param status application status
     * @param pageable pagination parameters
     * @return Page of ProjectApplication
     */
    @EntityGraph(attributePaths = {"project", "applicant", "reviewedBy"})
    @Query("SELECT a FROM ProjectApplication a WHERE a.applicant.id = :applicantId AND a.status = :status ORDER BY a.createdAt DESC")
    Page<ProjectApplication> findByApplicantIdAndStatus(
        @Param("applicantId") Long applicantId,
        @Param("status") ApplicationStatus status,
        Pageable pageable
    );
    
    /**
     * Checks if an application exists for project and applicant.
     * 
     * @param projectId project ID
     * @param applicantId applicant user ID
     * @return true if application exists
     */
    boolean existsByProjectIdAndApplicantId(Long projectId, Long applicantId);
    
    /**
     * Counts pending applications for a project.
     * 
     * @param projectId project ID
     * @return count of pending applications
     */
    @Query("SELECT COUNT(a) FROM ProjectApplication a WHERE a.project.id = :projectId AND a.status = 'PENDING'")
    long countPendingByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Deletes all applications for a project.
     * 
     * @param projectId project ID
     */
    @Modifying
    @Query("DELETE FROM ProjectApplication a WHERE a.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
    
    /**
     * Finds all applications for a project (without pagination).
     * 
     * @param projectId project ID
     * @return List of ProjectApplication
     */
    @Query("SELECT a FROM ProjectApplication a WHERE a.project.id = :projectId")
    java.util.List<ProjectApplication> findAllByProjectId(@Param("projectId") Long projectId);
}
