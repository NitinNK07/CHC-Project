package com.avirat.chc.user_Response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DosageResponseDTO {
    private Integer doseId;
    private Boolean morning;
    private Boolean afternoon;
    private Boolean night;

}
