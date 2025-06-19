package com.avirat.chc.user_Response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordResponseDTO {
    private String medicalRecordID;
    private String createDate;
    private Long doctorRegNo;
    private List<MedicineInfoResponseDTO> medicineInfoResponseDTOList;
}
