package com.backend.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.AddBusRequest;
import com.backend.service.BusService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/provider")
@RequiredArgsConstructor
public class ProviderBusController {

    private final BusService busService;

    @PostMapping("/buses/{providerId}")
    public ResponseEntity<ApiResponse<Void>> addBus(
            @PathVariable Long providerId,
            @Valid @RequestBody AddBusRequest request) {

        busService.addBus(providerId, request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bus added successfully", null)
        );
    }
}
