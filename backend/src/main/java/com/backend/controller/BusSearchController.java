package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.SearchBusResponse;
import com.backend.service.BusService;
import com.backend.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BusSearchController {

    private final BusService busService;

    @GetMapping("/buses/search")
    public ResponseEntity<ApiResponse<List<SearchBusResponse>>> searchBuses(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date) {

        List<SearchBusResponse> result =
                busService.searchBuses(from, to, date);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Buses fetched", result)
        );
    }
}
