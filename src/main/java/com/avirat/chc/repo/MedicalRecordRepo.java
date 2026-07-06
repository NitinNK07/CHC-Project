package com.avirat.chc.repo;

import com.avirat.chc.entity.MedicalRecordEntity;
import com.avirat.chc.entity.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface MedicalRecordRepo extends JpaRepository<MedicalRecordEntity, String> {
        public Optional<List<MedicalRecordEntity>> findByPatientEntity(PatientEntity patientEntity);

}
