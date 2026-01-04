package com.multiworkbackend.repo;

import com.multiworkbackend.entity.SocialMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialMediaRepo extends JpaRepository<SocialMedia, Long> {
}
