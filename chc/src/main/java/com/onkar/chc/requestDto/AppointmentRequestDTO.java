package com.onkar.chc.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequestDTO {
    private String patientHealthCardNo;
    private Long doctorRegiNo;
    private String appointmentDate;
    private String appointmentTime;
    private String reason;
    private String status;
}
