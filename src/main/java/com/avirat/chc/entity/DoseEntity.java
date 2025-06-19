package com.avirat.chc.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "DOSE_OF_MEDICINE")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Integer doseId;

    //Morning
    @Column(name = "MORNING_DOSE",nullable = false)
    private Boolean morning;

    //Afternoon
    @Column(name = "AFTERNOON_DOSE",nullable = false)
    private Boolean afternoon;

    //Night
    @Column(name = "NIGHT",nullable = false)
    private  Boolean night;
}
