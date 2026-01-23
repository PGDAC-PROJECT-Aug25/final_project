package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddScheduleRequest {

    @NotNull
    private Long busId;

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotBlank
    private String travelDate;
    
    @NotBlank
    private String departureTime;   

    @NotBlank
    private String arrivalTime;     

    @NotNull
    @Positive
    private Double price;
}
