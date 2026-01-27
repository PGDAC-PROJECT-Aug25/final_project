package com.backend.service;

import java.util.List;
import com.backend.dto.*;

public interface AdminService {

    List<AdminUserResponse> getAllUsers();

    List<AdminBusResponse> getAllBuses();

    List<AdminBookingResponse> getAllBookings();

    void verifyProvider(Long providerId);

    AdminSummaryResponse getSummary();

}
