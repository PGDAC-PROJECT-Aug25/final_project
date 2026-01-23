package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookingHistoryResponse {

    private Long bookingId;
    private String busNumber;
    private String source;
    private String destination;
    private String travelDate;
    private String departureTime;
    private String seatNumber;
    private Double price;
    private String status;
}
