package com.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.dto.BookingHistoryResponse;
import com.backend.dto.CancelBookingsRequest;
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
    public void createBooking(CreateBookingRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BusSchedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        for (String seatNo : request.getSeatNumbers()) {

            BusSeat seat = seatRepository
                    .findForUpdate(request.getScheduleId(), seatNo)
                    .orElseThrow(() -> new ResourceNotFoundException("Seat not found: " + seatNo));

            if (seat.getIsBooked()) {
                throw new ResourceNotFoundException("Seat already booked: " + seatNo);
            }

            seat.setIsBooked(true);

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setSchedule(schedule);
            booking.setSeatNumber(seatNo);
            booking.setStatus(BookingStatus.CONFIRMED);

            bookingRepository.save(booking);
        }
    }
    
    @Override
    public List<BookingHistoryResponse> getBookingHistory( Long userId ) {

        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException( "User not found" ));

        List<Booking> bookings =
                bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return bookings.stream().map(b -> new BookingHistoryResponse(
                b.getId(),
                b.getSchedule().getBus().getBusNumber(),
                b.getSchedule().getRoute().getSource(),
                b.getSchedule().getRoute().getDestination(),
                b.getSchedule().getTravelDate().toString(),
                b.getSchedule().getDepartureTime().toLocalTime().toString(),
                b.getSeatNumber(),
                b.getSchedule().getPrice(),
                b.getStatus().name()
        )).toList();
    }
    
    @Override
    public void cancelBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking already cancelled ");
        }

        BusSeat seat = seatRepository
                .findForUpdate(booking.getSchedule().getId(), booking.getSeatNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

        seat.setIsBooked(false);
        booking.setStatus(BookingStatus.CANCELLED);
    }

  
    @Override
    public void cancelBookings(CancelBookingsRequest request) {
    		List<Booking> bookings =
                bookingRepository.findByIdIn( request.getBookingIds() );

        if (bookings.size() != request.getBookingIds().size()) {
            throw new ResourceNotFoundException( "One or more bookings not found" );
        }

        for (Booking booking : bookings) {

            if (booking.getStatus() == BookingStatus.CANCELLED) {
                throw new IllegalStateException(
                        "Booking already cancelled: " + booking.getId());
            }

            BusSeat seat = seatRepository
                    .findForUpdate(booking.getSchedule().getId(), booking.getSeatNumber())
                    .orElseThrow(() -> new ResourceNotFoundException( "Seat not found" ));

            seat.setIsBooked( false );
            booking.setStatus( BookingStatus.CANCELLED );
        }
    }

}

