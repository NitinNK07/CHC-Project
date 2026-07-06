package com.onkar.chc.service;

import com.onkar.chc.requestDto.AppointmentRequestDTO;
import com.onkar.chc.responseDto.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO requestDTO);
    List<AppointmentResponseDTO> getPatientAppointments(String patientHealthCardNo);
    List<AppointmentResponseDTO> getDoctorAppointments(Long doctorRegiNo);
    AppointmentResponseDTO updateAppointmentStatus(Long id, String status, String newDate, String newTime);
}
