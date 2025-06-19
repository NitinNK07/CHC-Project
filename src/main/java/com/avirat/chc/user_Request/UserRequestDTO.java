package com.avirat.chc.user_Request;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.validation.annotation.Validated;

@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequestDTO {

    @NotNull(message = "userName can not be null")
    @NotEmpty(message = "userName can not be Empty")
    @NotBlank(message = "userName can not be Blank")
    @Size(max=50,min = 5,message="UserId should be greater than 5 char and less than 50 char")
    private String userName;

    @NotNull(message = "firstName can not be null")
    @NotEmpty(message = "firstName can not be Empty")
    @NotBlank(message = "firstName can not be Blank")
    @Size(max=20,min = 2,message="firstName should be greater than 2 char and less than 20 char")
    private String firstName;

    @NotNull(message = "lastName can not be null")
    @NotEmpty(message = "lastName can not be Empty")
    @NotBlank(message = "lastName can not be Blank")
    @Size(max=20,min = 2,message="lastName should be greater than 2 char and less than 20 char")
    private String lastName;


    @NotNull(message = "password can not be null")
    @NotEmpty(message = "password can not be Empty")
    @NotBlank(message = "password can not be Blank")
    @Size(max=20,min = 7,message="password should be greater than 7 char and less than 20 char")
   // @Pattern(regexp = "^(?=.[a-z])(?=.[A-Z])(?=.\\\\d)(?=.[@$!%?&])[A-Za-z\\\\d@$!%?&]{8,20}$")
    private String password;

    @NotNull(message = "email can not be null")
    @NotEmpty(message = "email can not be Empty")
    @NotBlank(message = "email can not be Blank")
    @Size(max=40,min = 1,message="email should be greater than 1 char and less than 20 char")
    //@Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    private String email;


    @NotNull(message = "contactNo can not be null")
   // @Size(max=10,min = 10,message="contactNo should be 10 Integer")
    private Long contactNo;

    @NotNull(message = "healthCardNo can not be null")
   /* @NotEmpty(message = "healthCardNo can not be Empty")
    @NotBlank(message = "healthCardNo can not be Blank")
    @Size(max=13,min = 5,message="healthCardNo should be 5-13 Integer")*/
    private Integer healthCardNo;

    @NotNull(message = "role can not be null")
    @NotEmpty(message = "role can not be Empty")
    @NotBlank(message = "role can not be Blank")
    @Size(max=20,min = 6,message="role should be greater than 6 char and less than 20 char")
    private String role;


    @NotNull(message = "dob can not be null")
    @NotEmpty(message = "dob can not be Empty")
    @NotBlank(message = "dob can not be Blank")
    @Size(max=10,min = 6,message="dob should be greater than 7 Integer and less than 10 Integer incl.'/'','-'','.'" )
    private String dob;


   // @Size(max=13,min = 6,message="doctorRegNo should be greater than 7 Integer and less than 13 Integer")
    private Long doctorRegNo;

    @NotNull(message = "address can not be null")
    @NotEmpty(message = "address can not be Empty")
    @NotBlank(message = "address can not be Blank")
    @Size(max=50,min = 6,message="address should be greater than 6 char and less than 50 char")
    private String address;

    @NotNull(message = "address can not be null")
    @NotEmpty(message = "address can not be Empty")
    @NotBlank(message = "address can not be Blank")
    @Size(max=15,min =3,message="address should be greater than 3 char and less than 15 char")
    private String gender;
}
