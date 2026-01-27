package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerProfileRequest {

    @NotBlank
    private String name;

    private String phone;
    private String address;
    private String dob;     // yyyy-MM-dd
    private String gender;
}
