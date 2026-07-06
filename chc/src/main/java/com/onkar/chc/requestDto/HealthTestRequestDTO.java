package com.onkar.chc.requestDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthTestRequestDTO {
    private String userName;
    private String bmi;
    private String bmiStatus;
    private Integer score;
    private String overallStatus;
    private Integer bloodPressureSys;
    private Integer bloodPressureDia;
    private String bloodPressureStatus;
    private Integer heartRateValue;
    private String heartRateStatus;
    private Integer spO2Value;
    private String spO2Status;
    private String completedAt;
}
