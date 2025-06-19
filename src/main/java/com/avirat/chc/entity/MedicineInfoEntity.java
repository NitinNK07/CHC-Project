package com.avirat.chc.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "MEDICINE_INFO")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MedicineInfoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="MEDICINE_INFO_ID")
    private String medicineInfoId;

    @Column(name = "MEDICINE_NAME",nullable = false)
    private String medicineName;

    @OneToOne
   // @Column(name = "DOSE_ID",nullable = false)
    private DoseEntity doseEntity;

    @Column(name = "NO_OF_DAYS",nullable = false)
    private Integer days;

    @Column(name = "REMARK",nullable = false,length = 500)
    private String remark;
}
