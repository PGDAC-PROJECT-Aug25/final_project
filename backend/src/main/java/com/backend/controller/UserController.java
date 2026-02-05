package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.*;
import com.backend.dto.JwtDTO;
import com.backend.service.UserService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;

    private Long getLoggedInUserId() {
        JwtDTO dto = (JwtDTO) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return dto.getUserId();
    }

    // ---- Customer ----
    @GetMapping("/customer-profile")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> getCustomer() {

        Long userId = getLoggedInUserId();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Customer profile fetched",
                        userService.getCustomerProfile(userId))
        );
    }

    @PutMapping("/customer-profile")
    public ResponseEntity<ApiResponse<Void>> updateCustomer(
            @Valid @RequestBody UpdateCustomerProfileRequest request) {

        Long userId = getLoggedInUserId();

        userService.updateCustomerProfile(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Customer profile updated", null)
        );
    }

    // ---- Provider ----
    @GetMapping("/provider-profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getProvider() {

        Long userId = getLoggedInUserId();

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider profile fetched",
                        userService.getProviderProfile(userId))
        );
    }

    @PutMapping("/provider-profile")
    public ResponseEntity<ApiResponse<Void>> updateProvider(
            @Valid @RequestBody UpdateProviderProfileRequest request) {

        Long userId = getLoggedInUserId();

        userService.updateProviderProfile(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Provider profile updated", null)
        );
    }

    // ---- Common ----
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        Long userId = getLoggedInUserId();

        userService.changePassword(userId, request);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Password updated", null)
        );
    }
}
