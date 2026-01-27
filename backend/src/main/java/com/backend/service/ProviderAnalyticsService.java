package com.backend.service;

import com.backend.dto.ProviderSummaryResponse;

public interface ProviderAnalyticsService {
	ProviderSummaryResponse getProviderSummary(Long providerId);

}
