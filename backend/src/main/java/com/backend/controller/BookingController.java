package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.CreateBookingRequest;
import com.backend.service.BookingService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<Void>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {

        bookingService.createBooking(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Booking successful", null)
        );
    }
}

