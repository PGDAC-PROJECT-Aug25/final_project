package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.*;
import com.backend.service.UserService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ---- Customer ----
    @GetMapping("/{userId}/customer-profile")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> getCustomer(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Customer profile fetched",
                        userService.getCustomerProfile(userId))
        );
    }

    @PutMapping("/{userId}/customer-profile")
    public ResponseEntity<ApiResponse<Void>> updateCustomer(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateCustomerProfileRequest request) {

        userService.updateCustomerProfile(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Customer profile updated", null));
    }

    // ---- Provider ----
    @GetMapping("/{userId}/provider-profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getProvider(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider profile fetched",
                        userService.getProviderProfile(userId))
        );
    }

    @PutMapping("/{userId}/provider-profile")
    public ResponseEntity<ApiResponse<Void>> updateProvider(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProviderProfileRequest request) {

        userService.updateProviderProfile(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Provider profile updated", null));
    }

    // ---- Common ----
    @PutMapping("/{userId}/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password updated", null));
    }
}
