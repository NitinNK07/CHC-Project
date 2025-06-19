package com.avirat.chc.service.impl;

import com.avirat.chc.entity.UserEntity;
import com.avirat.chc.repo.UserRepo;
import com.avirat.chc.service.UserService;
import com.avirat.chc.user_Request.UserRequestDTO;
import com.avirat.chc.user_Response.UserResponseDTO;
import org.modelmapper.ModelMapper;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserServiseIMPL implements UserService {



    Logger log=LoggerFactory.getLogger( UserServiseIMPL.class);

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRepo userRepo;


    @Override
    public String signUp(UserRequestDTO userRequestDTO) {
        log.info("Sign up method is called");

        // Prevent accidental update
        //userRequestDTO.setUserId(null);

        UserEntity userEntity = modelMapper.map(userRequestDTO, UserEntity.class);
        System.out.println(userEntity.getDoctorRegNo());
        log.info("Mapped User Entity: {} {}", userEntity.getHealthCardNo(), userEntity.getUserName());

        UserEntity saved = userRepo.save(userEntity);

        return saved != null ? "User is Registered Successfully" : "User is not Registered";
    }


    @Override
    public UserResponseDTO login(String userName, String password) {

        UserEntity userEntity=userRepo.findByUserName(userName).get();
        if(userEntity.getPassword().equals(password)){
            return modelMapper.map(userEntity,UserResponseDTO.class);
        }else {
            return null;
        }
    }

    //update at homeAssignment
    @Override
    public String updateUserData(Integer healthCardId, UserRequestDTO userRequestDTO) {
        log.info("Updating user data for healthCardId: {}", healthCardId);

        UserEntity existingUser = userRepo.findByHealthCardNo(healthCardId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setUserName(userRequestDTO.getUserName());
        existingUser.setPassword(userRequestDTO.getPassword());

        userRepo.save(existingUser);

        return "User data updated successfully";
    }

    public UserEntity getUserByHealthCardNo(Integer healthCardNo) {
        Optional<UserEntity> userOpt = userRepo.findByHealthCardNo(healthCardNo);
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found for Health Card No: " + healthCardNo);
        }
        return userOpt.get();
    }

    @Override
    public UserResponseDTO getUserData(Integer userId) {
        UserEntity userEntity =userRepo.findById(userId).get();
        return modelMapper.map(userEntity, UserResponseDTO.class);
    }


}
