package com.onkar.chc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "APPOINTMENTS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "PATIENT_HEALTH_CARD_NO", nullable = false)
    private String patientHealthCardNo;

    @Column(name = "DOCTOR_REGI_NO", nullable = false)
    private Long doctorRegiNo;

    @Column(name = "PATIENT_NAME")
    private String patientName;

    @Column(name = "DOCTOR_NAME")
    private String doctorName;

    @Column(name = "APPOINTMENT_DATE", nullable = false)
    private String appointmentDate;

    @Column(name = "APPOINTMENT_TIME", nullable = false)
    private String appointmentTime;

    @Column(name = "STATUS", nullable = false)
    private String status; // PENDING, ACCEPTED, RESCHEDULED, REJECTED

    @Column(name = "REASON")
    private String reason;
}
