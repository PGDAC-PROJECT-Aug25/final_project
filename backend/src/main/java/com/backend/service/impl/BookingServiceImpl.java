package com.backend.service.impl;

import org.springframework.stereotype.Service;

import com.backend.dto.CreateBookingRequest;
import com.backend.entity.Booking;
import com.backend.entity.BookingStatus;
import com.backend.entity.BusSchedule;
import com.backend.entity.BusSeat;
import com.backend.entity.User;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.BookingRepository;
import com.backend.repository.BusScheduleRepository;
import com.backend.repository.BusSeatRepository;
import com.backend.repository.UserRepository;
import com.backend.service.BookingService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BusSeatRepository seatRepository;
    private final BusScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createBooking(CreateBookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BusSchedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        BusSeat seat = seatRepository
                .findForUpdate(request.getScheduleId(), request.getSeatNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

        if (seat.getIsBooked()) {
            throw new IllegalStateException("Seat already booked");
        }

        // Mark seat as booked
        seat.setIsBooked(true);

        // Create booking
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setSeatNumber(seat.getSeatNumber());
        booking.setStatus(BookingStatus.CONFIRMED);

        bookingRepository.save(booking);
        // seat update is auto-flushed on transaction commit
    }
}

