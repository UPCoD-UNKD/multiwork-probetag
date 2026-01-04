package com.multiworkbackend.repo;

import com.multiworkbackend.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LinkRepo extends JpaRepository<Link, Long> {
}
