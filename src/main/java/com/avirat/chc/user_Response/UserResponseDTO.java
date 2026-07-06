package com.avirat.chc.user_Response;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {

    private Integer userId;

    private String userName;

    private String firstName;

    private String lastName;

    private String password;

    private String email;

    private Long contactNo;

    private Integer healthCardNo;

    private String role;

    private String dob;

    private Integer doctorRegNo;

    private String address;

    private String gender;
}
