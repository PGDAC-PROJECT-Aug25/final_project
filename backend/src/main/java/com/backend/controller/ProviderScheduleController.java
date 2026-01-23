package com.backend.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.AddScheduleRequest;
import com.backend.service.BusService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderScheduleController {

    private final BusService busService;

    @PostMapping("/schedules/{providerId}")
    public ResponseEntity<ApiResponse<Void>> addSchedule(
            @PathVariable Long providerId,
            @Valid @RequestBody AddScheduleRequest request) {

        busService.addSchedule(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Schedule added successfully", null)
        );
    }
}
