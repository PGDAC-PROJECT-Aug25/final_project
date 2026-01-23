package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.BookingHistoryResponse;
import com.backend.service.BookingService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BookingHistoryController {

    private final BookingService bookingService;

    @GetMapping("/bookings/user/{userId}")
    public ResponseEntity<ApiResponse<List<BookingHistoryResponse>>> getHistory(
            @PathVariable Long userId) {

        List<BookingHistoryResponse> history =
                bookingService.getBookingHistory(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings fetched", history)
        );
    }
}
