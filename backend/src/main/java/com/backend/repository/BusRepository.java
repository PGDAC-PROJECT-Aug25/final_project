package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Bus;

public interface BusRepository extends JpaRepository<Bus, Long> {
	boolean existsByProviderIdAndBusNumber(Long providerId, String busNumber);

}

