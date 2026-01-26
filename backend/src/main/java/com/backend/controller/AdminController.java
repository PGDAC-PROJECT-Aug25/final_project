package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.*;
import com.backend.service.AdminService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> users() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Users fetched", adminService.getAllUsers())
        );
    }

    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<AdminBusResponse>>> buses() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Buses fetched", adminService.getAllBuses())
        );
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<AdminBookingResponse>>> bookings() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings fetched", adminService.getAllBookings())
        );
    }

    @PutMapping("/providers/{providerId}/verify")
    public ResponseEntity<ApiResponse<Void>> verify(@PathVariable Long providerId) {
        adminService.verifyProvider(providerId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider verified", null)
        );
    }
}
