package com.onkar.chc.repo;

import com.onkar.chc.entity.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<AppointmentEntity, Long> {
    List<AppointmentEntity> findByPatientHealthCardNoOrderByAppointmentDateDesc(String patientHealthCardNo);
    List<AppointmentEntity> findByDoctorRegiNoOrderByAppointmentDateDesc(Long doctorRegiNo);
}
