package com.onkar.chc.service;

import com.onkar.chc.requestDto.HealthTestRequestDTO;
import com.onkar.chc.responseDto.HealthTestResponseDTO;

public interface HealthTestService {
    HealthTestResponseDTO saveTestResults(HealthTestRequestDTO requestDTO);
    HealthTestResponseDTO getTestResults(String userName);
}
