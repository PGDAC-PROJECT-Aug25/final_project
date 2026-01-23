package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
