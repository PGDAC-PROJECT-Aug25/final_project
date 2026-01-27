package com.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
	List<Booking> findByIdIn(List<Long> ids);
	
	// revenue (system)
	@Query("""
	select coalesce(sum(s.price), 0)
	from Booking b
	join b.schedule s
	where b.status = 'CONFIRMED'
	""")
	Double totalRevenue();

	// provider-wise revenue
	@Query("""
	select coalesce(sum(s.price), 0)
	from Booking b
	join b.schedule s
	join s.bus bu
	where b.status = 'CONFIRMED' and bu.provider.id = :providerId
	""")
	Double providerRevenue(Long providerId);

	// provider bookings count
	@Query("""
	select count(b)
	from Booking b
	join b.schedule s
	join s.bus bu
	where bu.provider.id = :providerId
	""")
	Long countByProvider(Long providerId);

}
