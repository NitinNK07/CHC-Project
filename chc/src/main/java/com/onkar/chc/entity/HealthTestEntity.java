package com.onkar.chc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "HEALTH_TEST")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthTestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "USER_NAME", unique = true, nullable = false)
    private String userName;

    @Column(name = "BMI")
    private String bmi;

    @Column(name = "BMI_STATUS")
    private String bmiStatus;

    @Column(name = "SCORE")
    private Integer score;

    @Column(name = "OVERALL_STATUS")
    private String overallStatus;

    @Column(name = "BP_SYS")
    private Integer bloodPressureSys;

    @Column(name = "BP_DIA")
    private Integer bloodPressureDia;

    @Column(name = "BP_STATUS")
    private String bloodPressureStatus;

    @Column(name = "HR_VALUE")
    private Integer heartRateValue;

    @Column(name = "HR_STATUS")
    private String heartRateStatus;

    @Column(name = "SPO2_VALUE")
    private Integer spO2Value;

    @Column(name = "SPO2_STATUS")
    private String spO2Status;

    @Column(name = "COMPLETED_AT")
    private String completedAt;
}
