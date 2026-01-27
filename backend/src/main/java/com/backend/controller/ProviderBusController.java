package com.backend.controller;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.*;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.ProviderRepository;
import com.backend.dto.JwtDTO;
import com.backend.service.BusService;
import com.backend.service.ProviderAnalyticsService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderBusController {

    private final BusService busService;
    private final ProviderAnalyticsService providerAnalyticsService;
    private final ProviderRepository providerRepository;

    private Long getProviderIdFromToken() {
        JwtDTO dto = (JwtDTO) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        Long userId = dto.getUserId();

        return providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"))
                .getId();
    }

    @PostMapping("/buses")
    public ResponseEntity<?> addBus(@Valid @RequestBody AddBusRequest request) {

        Long providerId = getProviderIdFromToken();
        busService.addBus(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus added successfully", null)
        );
    }

    @PostMapping("/schedules")
    public ResponseEntity<?> addSchedule(@Valid @RequestBody AddScheduleRequest request) {

        Long providerId = getProviderIdFromToken();
        busService.addSchedule(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Schedule added successfully", null)
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {

        Long providerId = getProviderIdFromToken();

        List<ProviderDashboardBusResponse> data =
                busService.getProviderDashboard(providerId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider dashboard fetched", data)
        );
    }

    @PutMapping("/buses/{busId}")
    public ResponseEntity<?> updateBus(
            @PathVariable Long busId,
            @Valid @RequestBody UpdateBusRequest request) {

        Long providerId = getProviderIdFromToken();
        busService.updateBus(providerId, busId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus Information Updated", null)
        );
    }

    @PutMapping("/buses/{busId}/status")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long busId,
            @Valid @RequestBody ChangeBusStatusRequest request) {

        Long providerId = getProviderIdFromToken();
        busService.changeBusStatus(providerId, busId, request.getStatus());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus status updated", null)
        );
    }

    @PutMapping("/schedules/{scheduleId}/cancel")
    public ResponseEntity<?> cancelSchedule(
            @PathVariable Long scheduleId) {

        Long providerId = getProviderIdFromToken();
        busService.cancelSchedule(providerId, scheduleId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Schedule cancelled", null)
        );
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<ApiResponse<ProviderSummaryResponse>> providerSummary() {

        Long providerId = getProviderIdFromToken();

        return ResponseEntity.ok(
            new ApiResponse<>(true, "Provider summary fetched",
                    providerAnalyticsService.getProviderSummary(providerId))
        );
    }
}
