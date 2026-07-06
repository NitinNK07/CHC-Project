package com.onkar.chc.service.serviceImpl;

import com.onkar.chc.entity.HealthTestEntity;
import com.onkar.chc.repo.HealthTestRepo;
import com.onkar.chc.requestDto.HealthTestRequestDTO;
import com.onkar.chc.responseDto.HealthTestResponseDTO;
import com.onkar.chc.service.HealthTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HealthTestServiceImpl implements HealthTestService {

    @Autowired
    private HealthTestRepo healthTestRepo;

    @Override
    public HealthTestResponseDTO saveTestResults(HealthTestRequestDTO requestDTO) {
        Optional<HealthTestEntity> existing = healthTestRepo.findByUserName(requestDTO.getUserName());
        
        HealthTestEntity entity = existing.orElse(new HealthTestEntity());
        entity.setUserName(requestDTO.getUserName());
        entity.setBmi(requestDTO.getBmi());
        entity.setBmiStatus(requestDTO.getBmiStatus());
        entity.setScore(requestDTO.getScore());
        entity.setOverallStatus(requestDTO.getOverallStatus());
        entity.setBloodPressureSys(requestDTO.getBloodPressureSys());
        entity.setBloodPressureDia(requestDTO.getBloodPressureDia());
        entity.setBloodPressureStatus(requestDTO.getBloodPressureStatus());
        entity.setHeartRateValue(requestDTO.getHeartRateValue());
        entity.setHeartRateStatus(requestDTO.getHeartRateStatus());
        entity.setSpO2Value(requestDTO.getSpO2Value());
        entity.setSpO2Status(requestDTO.getSpO2Status());
        entity.setCompletedAt(requestDTO.getCompletedAt());
        
        HealthTestEntity saved = healthTestRepo.save(entity);
        
        return mapToDTO(saved);
    }

    @Override
    public HealthTestResponseDTO getTestResults(String userName) {
        Optional<HealthTestEntity> entity = healthTestRepo.findByUserName(userName);
        return entity.map(this::mapToDTO).orElse(null);
    }
    
    private HealthTestResponseDTO mapToDTO(HealthTestEntity entity) {
        return HealthTestResponseDTO.builder()
                .userName(entity.getUserName())
                .bmi(entity.getBmi())
                .bmiStatus(entity.getBmiStatus())
                .score(entity.getScore())
                .overallStatus(entity.getOverallStatus())
                .bloodPressureSys(entity.getBloodPressureSys())
                .bloodPressureDia(entity.getBloodPressureDia())
                .bloodPressureStatus(entity.getBloodPressureStatus())
                .heartRateValue(entity.getHeartRateValue())
                .heartRateStatus(entity.getHeartRateStatus())
                .spO2Value(entity.getSpO2Value())
                .spO2Status(entity.getSpO2Status())
                .completedAt(entity.getCompletedAt())
                .build();
    }
}
