package com.avirat.chc.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "PATIENT_INFO")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientEntity {

    @Id
    @Column(name = "HEALTH_CARD_NO")
    private Integer healthCardNo;

    @Column(name = "USER_NAME", nullable = false)
    private String userName;

    @Column(name = "DOB", nullable = false)
    private String dob;

    @Column(name = "AGE", nullable = false)
    private Integer age;

    @Column(name = "WEIGHT", nullable = false)
    private Double weight;

    @Column(name = "GENDER", nullable = false)
    private String gender;

    @Column(name = "BP", nullable = false)
    private String bp;

    @Column(name = "BG", nullable = false)
    private String bg;

}
