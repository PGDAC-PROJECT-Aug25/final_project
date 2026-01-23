package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchBusResponse {

    private Long scheduleId;
    private String busNumber;
    private String busType;
    private String source;
    private String destination;
    private String departureTime;
    private String arrivalTime;
    private Double price;
    private Long availableSeats;
}
