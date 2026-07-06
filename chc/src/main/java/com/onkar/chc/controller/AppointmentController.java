package com.onkar.chc.controller;

import com.onkar.chc.requestDto.AppointmentRequestDTO;
import com.onkar.chc.responseDto.AppointmentResponseDTO;
import com.onkar.chc.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chc/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<AppointmentResponseDTO> bookAppointment(@RequestBody AppointmentRequestDTO requestDTO) {
        AppointmentResponseDTO response = appointmentService.bookAppointment(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/patient/{healthCardNo}")
    public ResponseEntity<List<AppointmentResponseDTO>> getPatientAppointments(@PathVariable String healthCardNo) {
        List<AppointmentResponseDTO> appointments = appointmentService.getPatientAppointments(healthCardNo);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @GetMapping("/doctor/{doctorRegiNo}")
    public ResponseEntity<List<AppointmentResponseDTO>> getDoctorAppointments(@PathVariable Long doctorRegiNo) {
        List<AppointmentResponseDTO> appointments = appointmentService.getDoctorAppointments(doctorRegiNo);
        return new ResponseEntity<>(appointments, HttpStatus.OK);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponseDTO> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody AppointmentRequestDTO requestDTO) {
        AppointmentResponseDTO response = appointmentService.updateAppointmentStatus(
                id, requestDTO.getStatus(), requestDTO.getAppointmentDate(), requestDTO.getAppointmentTime());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
