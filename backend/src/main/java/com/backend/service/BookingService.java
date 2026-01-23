package com.backend.service;

import com.backend.dto.CreateBookingRequest;

public interface BookingService {
    void createBooking(CreateBookingRequest request);
}
