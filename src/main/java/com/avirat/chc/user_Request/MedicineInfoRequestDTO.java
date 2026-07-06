package com.avirat.chc.user_Request;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.validation.annotation.Validated;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Validated
public class MedicineInfoRequestDTO {

    @NotNull(message = "medicineName can not be null")
    @NotEmpty(message = "medicineName can not be Empty")
    @NotBlank(message = "medicineName can not be Blank")
    @Size(max=50,min = 5,message="medicineName should be greater than 5 char and less than 50 char")
    private String medicineName;

    @NotNull(message = "doseRequestDTO can not be null")
    @NotEmpty(message = "doseRequestDTO can not be Empty")
    @NotBlank(message = "doseRequestDTO can not be Blank")
    @OneToOne
    private DoseRequestDTO doseRequestDTO;

    @NotNull(message = "days can not be null")
    @NotEmpty(message = "days can not be Empty")
    @NotBlank(message = "days can not be Blank")
    @Size(max=31,min = 1,message="days should be greater than 1 Integer and less than 31 char")
    private Integer days;

   //it can be null,empty,blank--<No Size Required>--
    private String remark;
}
