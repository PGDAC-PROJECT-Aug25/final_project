package com.backend.service;

import java.util.List;

import com.backend.dto.BookingHistoryResponse;
import com.backend.dto.CreateBookingRequest;

public interface BookingService {
    void createBooking(CreateBookingRequest request);
    List<BookingHistoryResponse> getBookingHistory(Long userId);
}
