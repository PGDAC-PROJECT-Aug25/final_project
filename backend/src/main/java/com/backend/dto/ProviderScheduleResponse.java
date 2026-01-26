package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProviderScheduleResponse {
    private Long scheduleId;
    private String source;
    private String destination;
    private String travelDate;
    private String departureTime;
    private String arrivalTime;
    private Double price;
    private String status;
    private Long availableSeats;
}
