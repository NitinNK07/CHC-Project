package com.avirat.chc.user_Response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineInfoResponseDTO {
    private String medicineInfoID;
    private String medicineName;
    private  DosageResponseDTO dosageResponseDTO;
    private Integer days;
    private String remark;
}
