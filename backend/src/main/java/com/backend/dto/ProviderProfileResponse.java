package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProviderProfileResponse {
    private Long providerId;
    private String name;
    private String email;
    private String businessName;
    private String contactNumber;
    private String gstNumber;
    private String companyAddress;
    private Boolean verified;
}
