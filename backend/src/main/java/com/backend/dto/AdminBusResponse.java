package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminBusResponse {
    private Long  busId;
    private String  busNumber;
    private String  busType;
    private Integer  totalSeats;
    private String  status;
    private String  providerName;
}
