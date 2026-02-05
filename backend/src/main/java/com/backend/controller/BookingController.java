package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.BookingHistoryResponse;
import com.backend.dto.CancelBookingsRequest;
import com.backend.dto.CreateBookingRequest;
import com.backend.dto.JwtDTO;
import com.backend.service.BookingService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bookings")
@CrossOrigin
public class BookingController {

    private final BookingService bookingService;

    @PostMapping()
    public ResponseEntity<ApiResponse<Void>> createBooking(
            @Valid @RequestBody CreateBookingRequest request) {

        bookingService.createBooking(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Booking successful", null)
        );
    }
    

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingHistoryResponse>>> getHistory() {
    	JwtDTO dto = (JwtDTO) SecurityContextHolder
    	        .getContext()
    	        .getAuthentication()
    	        .getPrincipal();

    	Long userId = dto.getUserId();

        List<BookingHistoryResponse> history =
                bookingService.getBookingHistory(userId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings fetched", history)
        );
    }
    
    
 // Cancel single seat
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelOne(@PathVariable Long bookingId) {

        bookingService.cancelBooking(bookingId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Booking cancelled", null)
        );
    }

    // Cancel multiple seats at one time
    @PutMapping("/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelMany(
            @Valid @RequestBody CancelBookingsRequest request) {

        bookingService.cancelBookings(request);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Bookings cancelled", null)
        );
    }
}

