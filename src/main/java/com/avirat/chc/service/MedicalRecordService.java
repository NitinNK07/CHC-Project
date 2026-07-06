package com.avirat.chc.service;

import com.avirat.chc.user_Request.MedicalRecordRequestDTO;
import com.avirat.chc.user_Response.MedicalHistoryResponseDTO;

public interface MedicalRecordService {

    public  Boolean validPatientAndDoctor(String userName,Integer healthCardNo,Long doctorId);

    public String createNewMedicalRecord(MedicalRecordRequestDTO medicalRecordRequestDTO,Integer healthCardNo);

    public Boolean validatePatient(String userName,Integer healthCard);

    public MedicalHistoryResponseDTO getMedicalRecord(Integer healthCardNo,String userName);
}
