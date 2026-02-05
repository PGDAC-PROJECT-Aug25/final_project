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
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    

    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<AdminBusResponse>>> buses() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Buses fetched", adminService.getAllBuses())
        );
    }
    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> users() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Users fetched", adminService.getAllUsers())
        );
    }
    
    @PutMapping("/providers/{providerId}/verify")
    public ResponseEntity<ApiResponse<Void>> verify(@PathVariable Long providerId) {
        adminService.verifyProvider(providerId);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider verified", null)
        );
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<AdminBookingResponse>>> bookings() {
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings fetched", adminService.getAllBookings())
        );
    }

    
    @GetMapping("/analytics/summary")
    public ResponseEntity<ApiResponse<AdminSummaryResponse>> adminSummary() {
        return ResponseEntity.ok(
            new ApiResponse<>(true, "Admin summary fetched", adminService.getSummary())
        );
    }
    
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> changeUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean active) {

        adminService.changeUserStatus(userId, active);

        return ResponseEntity.ok(
            new ApiResponse<>(true, "User status updated", null)
        );
    }


}
