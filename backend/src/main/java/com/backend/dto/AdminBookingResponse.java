package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminBookingResponse {
    private Long bookingId;
    private String userName;
    private String busNumber;
    private String source;
    private String destination;
    private String travelDate;
    private String seatNumber;
    private Double price;
    private String status;
}
