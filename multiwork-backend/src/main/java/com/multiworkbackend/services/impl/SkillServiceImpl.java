package com.multiworkbackend.services.impl;

import com.multiworkbackend.dto.PageResponse;
import com.multiworkbackend.entity.Skill;
import com.multiworkbackend.exceptions.NoSuchElementFoundException;
import com.multiworkbackend.repo.SkillRepo;
import com.multiworkbackend.services.SkillService;
import com.multiworkbackend.util.PageResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SkillServiceImpl implements SkillService {
    private final SkillRepo skillRepo;
    
    @Override
    @Transactional(readOnly = true)
    public Skill findByName(String name) throws NoSuchElementFoundException {
        Skill skill = skillRepo.findByName(name);
        if (skill == null) {
            throw new NoSuchElementFoundException("Skill not found with name: " + name);
        }
        return skill;
    }

    @Override
    @Transactional(readOnly = true)
    public Skill findById(Long id) throws NoSuchElementFoundException {
        return skillRepo.findById(id).orElseThrow(() -> new NoSuchElementFoundException("Skill doesn't exist"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Skill> findAll() {
        return skillRepo.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<Skill> findAll(Pageable pageable) {
        return PageResponseUtil.toPageResponse(skillRepo.findAll(pageable));
    }
}
