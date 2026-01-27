package com.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class  AddBusRequest {

    @NotBlank
    private String busNumber;

    @NotNull
    private String busType;   // e.g. AC_SLEEPER

    @NotNull
    @Min(1)
    private Integer totalSeats;
}
