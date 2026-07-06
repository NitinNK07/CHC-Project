package com.avirat.chc.user_Response;

import lombok.*;

import java.security.PrivateKey;
import java.util.PrimitiveIterator;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponseDTO {
    private Integer healthCardNo;
    private String userName;
    private String dob;
    private Integer age;
    private Integer weight;
    private String bp;
}
