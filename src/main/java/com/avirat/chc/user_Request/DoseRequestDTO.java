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
public class DoseRequestDTO {

    @NotNull(message = "morning can not be null")
    @NotEmpty(message = "morning can not be Empty")
    @NotBlank(message = "morning can not be Blank")
    @Size(max=7,min = 7,message="morning should be  7 char")
    private  Boolean morning;

    @NotNull(message = "afternoon can not be null")
    @NotEmpty(message = "afternoon can not be Empty")
    @NotBlank(message = "afternoon can not be Blank")
    @Size(max=9,min = 9,message="afternoon should be  9 char")
    private Boolean afternoon;

    @NotNull(message = "night can not be null")
    @NotEmpty(message = "night can not be Empty")
    @NotBlank(message = "night can not be Blank")
    @Size(max=5,min = 5,message="UserId should be 5 char")
    private Boolean night;
}
