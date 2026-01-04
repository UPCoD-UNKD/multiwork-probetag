package com.multiworkbackend.repo;

import com.multiworkbackend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long>{
    @EntityGraph(attributePaths = {
        "creatorProjects", 
        "memberProjects", 
        "followingToProjects",
        "skills", 
        "links", 
        "socialMediaSet",
        "collaborators",
        "following",
        "followers",
        "comments"
    })
    Optional<User> findByUsername(String username);

    @EntityGraph(attributePaths = {
        "creatorProjects", 
        "memberProjects", 
        "followingToProjects",
        "skills", 
        "links", 
        "socialMediaSet",
        "collaborators",
        "following",
        "followers",
        "comments"
    })
    @Query("SELECT u FROM User u WHERE u.id = :id")
    Optional<User> findByIdWithDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = {"skills"})
    @Query("SELECT u FROM User u")
    List<User> findAllWithSkills();
    
    @EntityGraph(attributePaths = {"skills"})
    @Query("SELECT u FROM User u WHERE :skillId IN (SELECT s.id FROM u.skills s)")
    org.springframework.data.domain.Page<User> findAllBySkillId(Long skillId, org.springframework.data.domain.Pageable pageable);

    @EntityGraph(attributePaths = {
        "memberProjects",
        "memberProjects.members",
        "memberProjects.skills",
        "memberProjects.creator"
    })
    @Query("SELECT u FROM User u WHERE u.username = :username")
    Optional<User> findByUsernameWithProjects(@Param("username") String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);
}
