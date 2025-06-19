package com.avirat.chc.service;

import com.avirat.chc.user_Request.UserRequestDTO;
import com.avirat.chc.user_Response.UserResponseDTO;

public interface UserService {

    //sign-up   DTO>> ENTITY
    public String signUp(UserRequestDTO userRequestDTO);

    //log-in     User VALID
    public UserResponseDTO login(String userName, String password);

    //update     DTO >> ENTITY
    public String updateUserData(Integer healthCardId,UserRequestDTO userRequestDTO);

    //get        ENTITY >> DTO
    public UserResponseDTO getUserData(Integer healthCardId);

}
