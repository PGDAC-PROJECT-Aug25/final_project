package com.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.BusSeat;

import jakarta.persistence.LockModeType;

public interface BusSeatRepository extends JpaRepository<BusSeat, Long> {
	long countByScheduleIdAndIsBookedFalse(Long scheduleId);
	List<BusSeat> findByScheduleIdOrderBySeatNumber(Long scheduleId);
	
	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT s FROM BusSeat s WHERE s.schedule.id = :scheduleId AND s.seatNumber = :seatNumber")
	Optional<BusSeat> findForUpdate(Long scheduleId, String seatNumber);


}
