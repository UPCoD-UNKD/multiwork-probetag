package com.multiworkbackend.repo;

import com.multiworkbackend.entity.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepo extends JpaRepository<Comment, Long> {
    
    @Override
    @EntityGraph(attributePaths = {"creator"})
    @NonNull
    Optional<Comment> findById(@NonNull Long id);
    
    /**
     * Deletes all comments for a project.
     * 
     * @param projectId project ID
     */
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}
