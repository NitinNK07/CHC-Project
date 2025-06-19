package com.avirat.chc.user_Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Validated
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalRecordRequestDTO {

    private Long doctorRegNo;

    private List<MedicineInfoRequestDTO> medicineInfoEntities;

    @NotNull(message = "patientEntity can not be null")
    @NotEmpty(message = "patientEntity can not be Empty")
    @NotBlank(message = "patientEntity can not be Blank")
    private PatientRequestDTO patientEntity;

}
