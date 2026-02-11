package com.backend.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.backend.dto.*;
import com.backend.entity.*;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.*;
import com.backend.service.AdminService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BusRepository busRepository;
    private final BookingRepository bookingRepository;
    private final ProviderRepository providerRepository;

    @Override
    public List<AdminUserResponse> getAllUsers() {

        List<User> users = userRepository.findAll();
        List<AdminUserResponse> result = new ArrayList<>();

        for (User u : users) {

            Long providerId = null;
            Boolean isProviderVerified = null;

            if (u.getRole() == Role.ROLE_PROVIDER) {
                providerRepository.findByUserId(u.getId())
                        .ifPresent(p -> {
                            // assign via holder variables
                        });
            }


            AdminUserResponse dto = new AdminUserResponse(
                    u.getId(),
                    u.getName(),
                    u.getEmail(),
                    u.getRole().name(),
                    u.getIsActive(),
                    u.getEmailVerified(),
                    null,   // providerId (default)
                    null    // isProviderVerified (default)
            );

            // If provider, enrich DTO
            if (u.getRole() == Role.ROLE_PROVIDER) {
                providerRepository.findByUserId(u.getId())
                        .ifPresent(p -> {
                            dto.setProviderId(p.getId());
                            dto.setIsProviderVerified(p.getVerified());
                        });
            }

            result.add(dto);
        }

        return result;
    }

    
    //admin to get all buses 
    @Override
    public List<AdminBusResponse> getAllBuses() {

        List<Bus> buses = busRepository.findAll();
        List<AdminBusResponse> result = new ArrayList<>();

        for (Bus b : buses) {
            AdminBusResponse dto = new AdminBusResponse(
                    b.getId(),
                    b.getBusNumber(),
                    b.getBusType().name(),
                    b.getTotalSeats(),
                    b.getStatus().name(),
                    b.getProvider().getUser().getName()
            );
            result.add(dto);
        }

        return result;
    }

    @Override
    public List<AdminBookingResponse> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();
        List<AdminBookingResponse> result = new ArrayList<>();

        for (Booking b : bookings) {
            AdminBookingResponse dto = new AdminBookingResponse(
                    b.getId(),
                    b.getUser().getName(),
                    b.getSchedule().getBus().getBusNumber(),
                    b.getSchedule().getRoute().getSource(),
                    b.getSchedule().getRoute().getDestination(),
                    b.getSchedule().getTravelDate().toString(),
                    b.getSeatNumber(),
                    b.getSchedule().getPrice(),
                    b.getStatus().name()
            );
            result.add(dto);
        }

        return result;
    }

    @Override
    public void verifyProvider(Long providerId) {

        ServiceProvider p = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        p.setVerified(true);
        providerRepository.save(p);
    }

    @Override
    public AdminSummaryResponse getSummary() {

        Double revenue = bookingRepository.totalRevenue();
        Long buses = busRepository.count();
        Long bookings = bookingRepository.count();
        Long customers = userRepository.countByRole(Role.ROLE_CUSTOMER);
        Long providers = providerRepository.count();

        return new AdminSummaryResponse(
                revenue,
                buses,
                bookings,
                customers,
                providers
        );
    }
    
    @Override
    public void changeUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsActive(active);
        userRepository.save(user);
    }


}
