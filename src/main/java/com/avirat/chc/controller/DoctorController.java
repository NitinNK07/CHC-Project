package com.avirat.chc.controller;

import com.avirat.chc.helper.CustomMessages;
import com.avirat.chc.service.MedicalRecordService;
import com.avirat.chc.user_Request.MedicalRecordRequestDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private MedicalRecordService medicalRecordService;


    @PostMapping("/createMedicalRecord")
    public ResponseEntity<CustomMessages> createMedicalRecord(@Valid@RequestParam String userName,@Valid @RequestParam Integer healthCardNo,@Valid @RequestBody MedicalRecordRequestDTO medicalRecordRequestDTO){
        String returnMsg;
        Boolean validated= medicalRecordService.validPatientAndDoctor(userName,healthCardNo, medicalRecordRequestDTO.getDoctorRegNo());
        if(validated)
            returnMsg = medicalRecordService.createNewMedicalRecord(medicalRecordRequestDTO,healthCardNo);
        else
            returnMsg="Patient or Doctor is not valid.";

        CustomMessages messages= CustomMessages.builder()
                .msg(returnMsg)
                .build();

        return new ResponseEntity<>(messages, HttpStatus.I_AM_A_TEAPOT);

    }

}


