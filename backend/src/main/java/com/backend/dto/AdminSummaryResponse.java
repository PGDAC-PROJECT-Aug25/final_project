package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminSummaryResponse {
    private Double  totalRevenue;
    private Long  totalBuses;
    private Long  totalBookings;
    private Long totalCustomers;
    private Long  totalProviders;
}
