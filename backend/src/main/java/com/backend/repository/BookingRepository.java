package com.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByIdIn(List<Long> ids);

    // System revenue (only PAID & COMPLETED)
    @Query("""
        select coalesce(sum(s.price), 0)
        from Booking b
        join b.schedule s
        where b.status in ('PAID', 'COMPLETED')
    """)
    Double totalRevenue();

    // Provider-wise revenue
    @Query("""
        select coalesce(sum(s.price), 0)
        from Booking b
        join b.schedule s
        join s.bus bu
        where b.status in ('PAID', 'COMPLETED')
          and bu.provider.id = :providerId
    """)
    Double providerRevenue(Long providerId);

    // Provider bookings count (exclude cancelled)
    @Query("""
        select count(b)
        from Booking b
        join b.schedule s
        join s.bus bu
        where bu.provider.id = :providerId
          and b.status <> 'CANCELLED'
    """)
    Long countByProvider(Long providerId);

    // Scheduler: move PAID -> COMPLETED after departure time
    @Query("""
        select b from Booking b
        join b.schedule s
        where b.status = 'PAID'
          and s.departureTime < :now
    """)
    List<Booking> findAllPaidBeforeNow(LocalDateTime now);
}
