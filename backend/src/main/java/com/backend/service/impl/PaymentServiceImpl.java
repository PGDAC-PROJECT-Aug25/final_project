package com.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.dto.DummyPaymentRequest;
import com.backend.entity.Booking;
import com.backend.entity.BookingStatus;
import com.backend.entity.Payment;
import com.backend.entity.PaymentStatus;
import com.backend.entity.User;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.BookingRepository;
import com.backend.repository.PaymentRepository;
import com.backend.repository.UserRepository;
import com.backend.service.PaymentService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Override
    public void pay(DummyPaymentRequest request, Long userId) {

        List<Booking> bookings =
                bookingRepository.findByIdIn(request.getBookingIds());

        if (bookings.isEmpty()) {
            throw new ResourceNotFoundException("Bookings not found");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        for (Booking b : bookings) {
            b.setStatus(BookingStatus.CONFIRMED);
        }

        Payment p = new Payment();
        p.setAmount(request.getAmount());
        p.setStatus(PaymentStatus.SUCCESS);
        p.setTransactionId("TXN-" + System.currentTimeMillis());
        p.setUser(user);

        paymentRepository.save(p);

       
    }
}

