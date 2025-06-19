package com.avirat.chc.controller;

import com.avirat.chc.service.MedicalRecordService;
import com.avirat.chc.user_Response.MedicalHistoryResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Validated
@Controller
@RequestMapping("/CHC")
@ResponseBody
public class MedicalHistoryController {
    @Autowired
    MedicalRecordService medicalRecordService;


    @GetMapping("/getMedicalRecord")
    public MedicalHistoryResponseDTO getMedicalHistory(@Valid @RequestParam Integer healthCardNo,@Valid @RequestParam String userName){
        return medicalRecordService.getMedicalRecord(healthCardNo,userName);
    }
}
