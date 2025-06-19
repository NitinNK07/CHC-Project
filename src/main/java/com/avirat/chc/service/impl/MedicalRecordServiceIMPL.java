package com.avirat.chc.service.impl;

import com.avirat.chc.entity.MedicalRecordEntity;
import com.avirat.chc.entity.PatientEntity;
import com.avirat.chc.entity.UserEntity;
import com.avirat.chc.repo.MedicalRecordRepo;
import com.avirat.chc.repo.PatientRepo;
import com.avirat.chc.repo.UserRepo;
import com.avirat.chc.service.MedicalRecordService;
import com.avirat.chc.user_Request.MedicalRecordRequestDTO;
import com.avirat.chc.user_Response.MedicalHistoryResponseDTO;
import com.avirat.chc.user_Response.MedicalRecordResponseDTO;
import com.avirat.chc.user_Response.PatientResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class  MedicalRecordServiceIMPL implements MedicalRecordService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    PatientRepo patientRepo;

    @Autowired
    MedicalRecordRepo medicalRecordRepo;

    @Override
    public Boolean validatePatient(String userName, Integer healthCardNo) {
        UserEntity userData = userRepo.getUserDataForCheck(userName, healthCardNo).orElseThrow(() -> new RuntimeException("Patient not found."));
        return true;
    }

    @Override
    public Boolean validPatientAndDoctor(String userName, Integer healthCardNo, Long doctorRegNo) {
        UserEntity userData=userRepo.getUserDataForCheck(userName,healthCardNo).orElse(null);
        UserEntity doctorDetails=userRepo.findByDoctorRegNo(doctorRegNo).orElse(null);
        if(userData!=null  &&  doctorDetails!=null){
            return true;
        }else {
            return false;

        }
    }



    @Override
    public String createNewMedicalRecord(MedicalRecordRequestDTO medicalRecordRequestDTO,Integer healthCardNo) {

        //DTO -> entity->full fill->Save
        MedicalRecordEntity medicalRecordEntity=modelMapper.map(medicalRecordRequestDTO, MedicalRecordEntity.class);
        //entity chya fields full fill karavya lagetil.

        //created date->DATE,LocalDate
        String currentDate=LocalDate.now().toString();
        medicalRecordEntity.setCreateDate(currentDate);

        //Object of Patient
      UserEntity userEntity=  userRepo.findByHealthCardNo(healthCardNo).orElseThrow(()->new RuntimeException("USER IS NOT FOUND!"));
      //pull patient object from medical Record
      PatientEntity patientEntity=medicalRecordEntity.getPatientEntity();
         //fullfill it using UserEntity
        patientEntity.setUserName(userEntity.getUserName());
        patientEntity.setHealthCardNo(userEntity.getHealthCardNo());
        patientEntity.setDob(userEntity.getDob());
        patientEntity.setGender(userEntity.getGender());
        //set back in to medical record
        medicalRecordEntity.setPatientEntity(patientEntity);

        medicalRecordRepo.save(medicalRecordEntity);
        return "Data is saved !";
    }

    @Override
    public MedicalHistoryResponseDTO getMedicalRecord(Integer healthCardNo,String userName) {
        PatientEntity patientEntity=patientRepo.findById(healthCardNo).orElseThrow(()->new RuntimeException("Patient is not found."));

        List<MedicalRecordEntity> medicalRecordEntityList=medicalRecordRepo.findByPatientEntity(patientEntity).orElseThrow(()->new RuntimeException("No medical records found."));

        List<MedicalRecordResponseDTO> medicalRecordResponseDTOList=medicalRecordEntityList.stream().map(a->modelMapper.map(a,MedicalRecordResponseDTO.class)).toList();

        return MedicalHistoryResponseDTO.builder()
                .patientEntity(modelMapper.map(patientEntity, PatientResponseDTO.class))
                .medicalRecordResponseDTOList(medicalRecordResponseDTOList)
                .build();
    }
}
