package com.onkar.chc.service.implementation;

import com.onkar.chc.entity.AppointmentEntity;
import com.onkar.chc.entity.DoctorEntity;
import com.onkar.chc.entity.UserEntity;
import com.onkar.chc.repo.AppointmentRepo;
import com.onkar.chc.repo.DoctorRepo;
import com.onkar.chc.repo.UserRepo;
import com.onkar.chc.requestDto.AppointmentRequestDTO;
import com.onkar.chc.responseDto.AppointmentResponseDTO;
import com.onkar.chc.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepo appointmentRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private DoctorRepo doctorRepo;

    @Override
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO requestDTO) {
        UserEntity patient = userRepo.findByHealthCardNo(requestDTO.getPatientHealthCardNo())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DoctorEntity doctor = doctorRepo.findByDoctorRegiNo(requestDTO.getDoctorRegiNo())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        UserEntity doctorUser = userRepo.findByUserName(doctor.getUserName())
                .orElseThrow(() -> new RuntimeException("Doctor user not found"));

        AppointmentEntity entity = AppointmentEntity.builder()
                .patientHealthCardNo(requestDTO.getPatientHealthCardNo())
                .doctorRegiNo(requestDTO.getDoctorRegiNo())
                .patientName(patient.getFirstName() + " " + patient.getLastName())
                .doctorName("Dr. " + doctorUser.getFirstName() + " " + doctorUser.getLastName())
                .appointmentDate(requestDTO.getAppointmentDate())
                .appointmentTime(requestDTO.getAppointmentTime())
                .reason(requestDTO.getReason())
                .status("PENDING")
                .build();

        entity = appointmentRepo.save(entity);
        return mapToDto(entity);
    }

    @Override
    public List<AppointmentResponseDTO> getPatientAppointments(String patientHealthCardNo) {
        return appointmentRepo.findByPatientHealthCardNoOrderByAppointmentDateDesc(patientHealthCardNo)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDTO> getDoctorAppointments(Long doctorRegiNo) {
        return appointmentRepo.findByDoctorRegiNoOrderByAppointmentDateDesc(doctorRegiNo)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AppointmentResponseDTO updateAppointmentStatus(Long id, String status, String newDate, String newTime) {
        AppointmentEntity entity = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        entity.setStatus(status);
        if (newDate != null && !newDate.trim().isEmpty()) {
            entity.setAppointmentDate(newDate);
        }
        if (newTime != null && !newTime.trim().isEmpty()) {
            entity.setAppointmentTime(newTime);
        }
        
        entity = appointmentRepo.save(entity);
        return mapToDto(entity);
    }

    private AppointmentResponseDTO mapToDto(AppointmentEntity entity) {
        return AppointmentResponseDTO.builder()
                .id(entity.getId())
                .patientHealthCardNo(entity.getPatientHealthCardNo())
                .doctorRegiNo(entity.getDoctorRegiNo())
                .patientName(entity.getPatientName())
                .doctorName(entity.getDoctorName())
                .appointmentDate(entity.getAppointmentDate())
                .appointmentTime(entity.getAppointmentTime())
                .status(entity.getStatus())
                .reason(entity.getReason())
                .build();
    }
}
