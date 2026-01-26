package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProviderProfileRequest {

    @NotBlank
    private String name;

    private String businessName;
    private String contactNumber;
    private String gstNumber;
    private String companyAddress;
}
