package com.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.BusRoute;

public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    Optional<BusRoute> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);
}
