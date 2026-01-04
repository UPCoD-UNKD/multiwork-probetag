package com.multiworkbackend.repo;

import com.multiworkbackend.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillRepo extends JpaRepository<Skill, Long> {
    Skill findByName(String name);
}
