package com.backend.dto;

import java.util.List;

import jakarta.validation.constraints.NotEmpty;
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

    @NotEmpty
    private List<String> seatNumbers;
}
