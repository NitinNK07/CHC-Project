package com.avirat.chc.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.engine.internal.Cascade;

import java.security.PrivateKey;
import java.util.List;

@Entity
@Table(name="MEDICAL_RECORDS_OF_PATIENT")
@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalRecordEntity {

    @Id
    @Column(name = "RECORD_Id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private String medicalRecordId;

    @Column(name = "CREATEDATE")
    private String createDate;

    @Column(name = "DOCTOR_REG_NO")
    private Long doctorRegNo;

    @OneToMany(cascade=CascadeType.ALL)
    private List<MedicineInfoEntity>medicineInfoEntities;

    @ManyToOne(cascade = CascadeType.DETACH)
    private PatientEntity patientEntity;

}
