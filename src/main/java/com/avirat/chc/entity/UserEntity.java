package com.avirat.chc.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="USER_iNFO")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "ID")
    private Integer healthCardId;



    @Column(name="USER_ID",nullable = false,unique = true)
    private String userName;


    @Column(name = "FIRST_NAME",nullable = false)
    private String firstName;


    @Column(name="LAST_NAME",nullable = false)
    private String lastName;


    @Column(name = "PASSWORD",nullable = false)
    private String password;


    @Column(name = "EMAIL",nullable = false,unique = true)
    private String email;


    @Column(name = "CONTACT_NO",nullable = false,unique = true)
    private long contactNo;


    @Column(name = "HEALTH_CARD_ID",nullable = false,unique = true)
    private Integer healthCardNo;


    @Column (name = "ROLE",nullable = false)
    private String role;


    @Column(name = "DOB",nullable = false)
    private String dob;


    @Column(name = "DOCTOR_ID",nullable = true,unique = true)
    private Long doctorRegNo;


    @Column(name = "MEDICAL_ID",nullable = true,unique = true)
    private Long medicalRegNo;


    @Column(name = "ADDRESS",nullable = false)
    private String address;


    @Column(name = "GENDER",nullable = false)
    private String gender;



}
