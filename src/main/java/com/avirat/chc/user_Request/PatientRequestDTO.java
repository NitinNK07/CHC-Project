package com.avirat.chc.user_Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Validated
public class PatientRequestDTO {

    @NotNull(message = "age can not be null")
    @NotEmpty(message = "age can not be Empty")
    @NotBlank(message = "age can not be Blank")
    @Size(max=100,min = 1,message="age should be greater than 0 Integer and less than 101  Integer")
    private Integer age;

    @NotNull(message = "weight can not be null")
    @NotEmpty(message = "weight can not be Empty")
    @NotBlank(message = "weight can not be Blank")
    @Size(max=180,min = 1,message="weight should be greater than 0 Integer and less than 181 Integer")
    private Integer weight;

    //It can be null
    @Size(max=150,min = 70,message="bp should be greater than 70 Integer and less than 150 Integer")
    private String bp;

    @NotNull(message = "blood group can not be null")
    @NotEmpty(message = "blood group can not be Empty")
    @NotBlank(message = "blood group can not be Blank")
    @Size(max=4,min = 2,message="blood group should be greater than 1 char and less than 4 char")
    private String bg;
}
