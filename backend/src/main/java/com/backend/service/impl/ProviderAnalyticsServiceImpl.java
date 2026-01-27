package com.backend.service.impl;

import org.springframework.stereotype.Service;

import com.backend.dto.ProviderSummaryResponse;
import com.backend.repository.BookingRepository;
import com.backend.repository.BusRepository;
import com.backend.repository.BusScheduleRepository;
import com.backend.service.ProviderAnalyticsService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProviderAnalyticsServiceImpl implements ProviderAnalyticsService {

	private final BusRepository busRepository;
	private final BusScheduleRepository busScheduleRepository;
	private final BookingRepository bookingRepository;
	@Override
	public ProviderSummaryResponse getProviderSummary(Long providerId) {

	    Long buses = busRepository.countByProviderId(providerId);
	    Long schedules = busScheduleRepository.countByBusProviderId(providerId);
	    Long bookings = bookingRepository.countByProvider(providerId);
	    Double revenue = bookingRepository.providerRevenue(providerId);

	    return new ProviderSummaryResponse(
	            buses,
	            schedules,
	            bookings,
	            revenue
	    );
	}


}
