package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.CancelBookingsRequest;
import com.backend.service.BookingService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookingCancelController {

    private final BookingService bookingService;

    // Cancel single seat
    @PutMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOne(@PathVariable Long bookingId) {

        bookingService.cancelBooking(bookingId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Booking cancelled", null)
        );
    }

    // Cancel multiple seats
    @PutMapping("/bookings/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelMany(
            @Valid @RequestBody CancelBookingsRequest request) {

        bookingService.cancelBookings(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings cancelled", null)
        );
    }
}
