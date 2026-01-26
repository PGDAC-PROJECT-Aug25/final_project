package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CustomerProfileResponse {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String dob;
    private String gender;
}
