package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SeatResponse {
    private String seatNumber;
    private Boolean isBooked;
}
