package com.backend.controller;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.AddBusRequest;
import com.backend.dto.AddScheduleRequest;
import com.backend.dto.ChangeBusStatusRequest;
import com.backend.dto.ProviderDashboardBusResponse;
import com.backend.dto.UpdateBusRequest;
import com.backend.service.BusService;
import com.backend.service.impl.BusServiceImpl;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderBusController {

    private final BusServiceImpl busServiceImpl;

    private final BusService busService;

   

    @PostMapping("/buses/{providerId}")
    public ResponseEntity<?> addBus(
            @PathVariable Long providerId,
            @Valid @RequestBody AddBusRequest request) {

        busService.addBus(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus added successfully", null)
        );
    }
    
    @PostMapping("/schedules/{providerId}")
    public ResponseEntity<?> addSchedule(
            @PathVariable Long providerId,
            @Valid @RequestBody AddScheduleRequest request) {

        busService.addSchedule(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Schedule added successfully", null)
        );
    }
    
    @GetMapping("/{providerId}/dashboard")
    public ResponseEntity<?> dashboard(
            @PathVariable Long providerId) {

        List<ProviderDashboardBusResponse> data =
                busService.getProviderDashboard(providerId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider dashboard fetched", data)
        );
    }
    
    
    @PutMapping("/buses/{providerId}/{busId}")
    public ResponseEntity<?> updateBus(@PathVariable Long providerId,
            @PathVariable Long busId,
            @Valid @RequestBody UpdateBusRequest request)
    {
    	busService.updateBus(providerId, busId , request);
    	
    	return ResponseEntity.ok(new ApiResponse<>(true, "Bus Information Updated", null));
    }
    
    @PutMapping("/buses/{providerId}/{busId}/status")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long providerId,
            @PathVariable Long busId,
            @Valid @RequestBody ChangeBusStatusRequest request) {

        busService.changeBusStatus(providerId, busId, request.getStatus());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus status updated", null)
        );
    }
    
    
    @PutMapping("/schedules/{providerId}/{scheduleId}/cancel")
    public ResponseEntity<?> cancelSchedule(
            @PathVariable Long providerId,
            @PathVariable Long scheduleId) {

        busService.cancelSchedule(providerId, scheduleId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Schedule cancelled", null)
        );
    }
}    
