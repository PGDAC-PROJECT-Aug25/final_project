package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProviderSummaryResponse {
    private Long totalBuses;
    private Long totalSchedules;
    private Long totalBookings;
    private Double totalRevenue;
}
