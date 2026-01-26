package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.SeatResponse;
import com.backend.service.BusService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class SeatController {

    private final BusService busService;

    //seat controllers
    @GetMapping("/schedules/{scheduleId}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeats(
            @PathVariable Long scheduleId) {

        List<SeatResponse> seats = busService.getSeatsBySchedule(scheduleId);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Seats fetched", seats)
        );
    }
}
