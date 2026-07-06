package com.avirat.chc.repo;

import com.avirat.chc.entity.MedicineInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineInfoRepo extends JpaRepository<MedicineInfoEntity, String> {


}

