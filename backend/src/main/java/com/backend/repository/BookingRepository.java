package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
	List<Booking> findByIdIn(List<Long> ids);
}
