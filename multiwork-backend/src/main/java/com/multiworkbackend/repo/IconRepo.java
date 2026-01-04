package com.multiworkbackend.repo;

import com.multiworkbackend.entity.Icon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IconRepo extends JpaRepository<Icon, Long> {
}
