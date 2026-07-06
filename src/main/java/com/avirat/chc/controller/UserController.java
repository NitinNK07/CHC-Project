package com.avirat.chc.controller;

import com.avirat.chc.service.UserService;
import com.avirat.chc.user_Request.UserRequestDTO;
import com.avirat.chc.user_Response.UserResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Validated
@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    // signUp

    @PostMapping("/signUpNew")
    public ResponseEntity<String> signUp(@Valid @RequestBody(required = true) UserRequestDTO userRequestDTO) {
        logger.info("Received sign-up request for user: {}", userRequestDTO.getUserName());
        String msg = userService.signUp(userRequestDTO);
        return new ResponseEntity<>(msg, HttpStatus.CREATED);
    }

    // login

    @GetMapping("/Login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestParam(name = "UserName") String userName,
                                                 @Valid   @RequestParam String password) {
        logger.info("Attempting login for user: {}", userName);
        UserResponseDTO userResponseDTO = userService.login(userName, password);
        if (userResponseDTO != null) {
            return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
        } else {
            logger.warn("Login failed for user: {}", userName);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    //update

    @PutMapping("/update/{healthCardId}")
    public ResponseEntity<String> updateUser(@Valid @PathVariable Integer healthCardId,@Valid @RequestBody UserRequestDTO userRequestDTO) {
        logger.info("Update request received for userId: {}", healthCardId);
        String msg = userService.updateUserData(healthCardId, userRequestDTO);
        return new ResponseEntity<>(msg, HttpStatus.OK);
    }


    // getUserData

    @GetMapping("/getPersonalInfo/{healthCardId}")
    public ResponseEntity<UserResponseDTO> getUserData(@Valid @PathVariable(name = "UserID") Integer healthCardId) {
        logger.info("Fetching personal info for user ID: {}", healthCardId);
        UserResponseDTO userResponseDTO = userService.getUserData(healthCardId);
        if (userResponseDTO != null) {
            return new ResponseEntity<>(userResponseDTO, HttpStatus.ACCEPTED);
        } else {
            logger.warn("User not found for ID: {}", healthCardId);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }
}
