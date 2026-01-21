package com.backend.dto;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CustomerRegisterRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6 , max=50)
    private String password;

    @NotBlank
    private String phone;

    @NotBlank
    private String address;

    @NotNull
    private LocalDate dob;

    @NotBlank
    private String gender;
}

