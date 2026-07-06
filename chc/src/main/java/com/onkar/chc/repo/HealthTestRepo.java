package com.onkar.chc.repo;

import com.onkar.chc.entity.HealthTestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthTestRepo extends JpaRepository<HealthTestEntity, Long> {
    Optional<HealthTestEntity> findByUserName(String userName);
}
