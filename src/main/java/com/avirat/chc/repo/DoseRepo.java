package com.avirat.chc.repo;

import com.avirat.chc.entity.DoseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DoseRepo extends JpaRepository<DoseEntity, Integer> {


    
}
