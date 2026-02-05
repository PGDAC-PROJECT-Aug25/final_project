package com.backend.service;

import java.util.List;

import com.backend.dto.AddBusRequest;
import com.backend.dto.AddScheduleRequest;
import com.backend.dto.ProviderDashboardBusResponse;
import com.backend.dto.SearchBusResponse;
import com.backend.dto.SeatResponse;
import com.backend.dto.UpdateBusRequest;

public interface BusService {
    void addBus(Long providerId, AddBusRequest request);
    
    //Bus Schedule API
    void addSchedule(Long providerId, AddScheduleRequest request);
    
    List<SearchBusResponse> searchBuses(String from, String to, String date);
    
    List<SeatResponse> getSeatsBySchedule(Long scheduleId);
    
    List<ProviderDashboardBusResponse> getProviderDashboard(Long providerId);
    
    void updateBus(Long providerId , Long busId, UpdateBusRequest request);
    
	void changeBusStatus (Long providerId,  Long busId,  String status);
		
		//Cancel schedule
		void cancelSchedule ( Long providerId, Long scheduleId );
}
