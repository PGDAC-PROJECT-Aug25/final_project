package com.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBookingRequest {

    @NotNull
    private Long userId;

    @NotNull
    private Long scheduleId;

    @NotNull
    private String seatNumber;
}
