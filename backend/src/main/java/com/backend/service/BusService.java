package com.backend.service;

import java.util.List;

import com.backend.dto.AddBusRequest;
import com.backend.dto.AddScheduleRequest;
import com.backend.dto.SearchBusResponse;
import com.backend.dto.SeatResponse;

public interface BusService {
    void addBus(Long providerId, AddBusRequest request);
    void addSchedule(Long providerId, AddScheduleRequest request);
    List<SearchBusResponse> searchBuses(String from, String to, String date);
    List<SeatResponse> getSeatsBySchedule(Long scheduleId);
}
