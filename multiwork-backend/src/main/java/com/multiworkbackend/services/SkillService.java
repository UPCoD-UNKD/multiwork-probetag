package com.multiworkbackend.services;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SkillService {

    Skill findByName(String name);

    Skill findById(Long id) throws NoSuchElementFoundException;

    List<Skill> findAll();
    
    PageResponse<Skill> findAll(Pageable pageable);
}
