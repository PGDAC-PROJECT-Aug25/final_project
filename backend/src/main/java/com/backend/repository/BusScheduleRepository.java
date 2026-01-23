package com.backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.BusSchedule;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
	boolean existsByBusIdAndTravelDateAndDepartureTime(
	        Long busId, LocalDate travelDate, LocalDateTime departureTime);
	
	@Query("""
	        SELECT s FROM BusSchedule s
	        JOIN s.route r
	        JOIN s.bus b
	        WHERE LOWER(r.source) = LOWER(:source)
	          AND LOWER(r.destination) = LOWER(:destination)
	          AND s.travelDate = :date
	          AND s.status = 'ACTIVE'
	          AND b.status = 'ACTIVE'
	    """)
	    List<BusSchedule> searchSchedules(String source, String destination, LocalDate date);      

}
