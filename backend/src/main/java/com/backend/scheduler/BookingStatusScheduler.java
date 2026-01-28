package com.backend.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.backend.entity.Booking;
import com.backend.entity.BookingStatus;
import com.backend.repository.BookingRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingStatusScheduler {

    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 1 * 60 * 1000) // every 1 minutes
    @Transactional
    public void markCompletedBookings() {

        List<Booking> bookings =
            bookingRepository.findAllPaidBeforeNow(LocalDateTime.now());

        for (Booking b : bookings) {
            b.setStatus(BookingStatus.COMPLETED);
        }
    }
}
