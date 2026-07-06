package com.onkar.chc.controller;

import com.onkar.chc.requestDto.HealthTestRequestDTO;
import com.onkar.chc.responseDto.HealthTestResponseDTO;
import com.onkar.chc.service.HealthTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/health-test")
public class HealthTestController {

    @Autowired
    private HealthTestService healthTestService;

    @PostMapping("/save")
    public ResponseEntity<HealthTestResponseDTO> saveTestResults(@RequestBody HealthTestRequestDTO requestDTO) {
        HealthTestResponseDTO response = healthTestService.saveTestResults(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userName}")
    public ResponseEntity<HealthTestResponseDTO> getTestResults(@PathVariable String userName) {
        HealthTestResponseDTO response = healthTestService.getTestResults(userName);
        if (response != null) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
