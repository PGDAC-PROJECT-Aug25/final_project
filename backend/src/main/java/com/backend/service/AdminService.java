package com.backend.service;

import java.util.List;

import com.backend.dto.AdminBookingResponse;
import com.backend.dto.AdminBusResponse;
import com.backend.dto.AdminSummaryResponse;
import com.backend.dto.AdminUserResponse;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();
    

    List<AdminBusResponse> getAllBuses();

    List<AdminBookingResponse> getAllBookings();

    void verifyProvider(Long providerId);

    AdminSummaryResponse getSummary();

	void changeUserStatus(Long userId, boolean active);

}
