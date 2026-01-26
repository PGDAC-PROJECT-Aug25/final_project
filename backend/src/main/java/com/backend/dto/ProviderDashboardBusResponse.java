package com.backend.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProviderDashboardBusResponse {
    private Long busId;
    private String busNumber;
    private String busType;
    private Integer totalSeats;
    private String status;
    private List<ProviderScheduleResponse> schedules;
}
