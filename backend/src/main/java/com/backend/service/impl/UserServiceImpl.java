package com.backend.service.impl;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.dto.*;
import com.backend.entity.Customer;
import com.backend.entity.ServiceProvider;
import com.backend.entity.User;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.CustomerRepository;
import com.backend.repository.ProviderRepository;
import com.backend.repository.UserRepository;
import com.backend.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final PasswordEncoder passwordEncoder;

    

    @Override
    public CustomerProfileResponse getCustomerProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer c = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

        return new CustomerProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                c.getPhone(),
                c.getAddress(),
                c.getDob() != null ? c.getDob().toString() : null,
                c.getGender()
        );
    }

    @Override
    public void updateCustomerProfile(Long userId, UpdateCustomerProfileRequest r) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Customer c = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

        user.setName(r.getName());
        c.setPhone(r.getPhone());
        c.setAddress(r.getAddress());
        if (r.getDob() != null && !r.getDob().isBlank()) {
            c.setDob(LocalDate.parse(r.getDob()));
        }
        c.setGender(r.getGender());

        userRepository.save(user);
        customerRepository.save(c);
    }

   

    @Override
    public ProviderProfileResponse getProviderProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ServiceProvider p = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));

        return new ProviderProfileResponse(
                p.getId(),
                user.getName(),
                user.getEmail(),
                p.getBusinessName(),
                p.getContactNumber(),
                p.getGstNumber(),
                p.getCompanyAddress(),
                p.getVerified()
        );
    }

    @Override
    public void updateProviderProfile(Long userId, UpdateProviderProfileRequest r) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ServiceProvider p = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));

        user.setName(r.getName());
        p.setBusinessName(r.getBusinessName());
        p.setContactNumber(r.getContactNumber());
        p.setGstNumber(r.getGstNumber());
        p.setCompanyAddress(r.getCompanyAddress());

        userRepository.save(user);
        providerRepository.save(p);
    }
    

    @Override
    public void changePassword(Long userId, ChangePasswordRequest r) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(r.getOldPassword(), user.getPassword())) {
            throw new com.backend.exception.IllegalArgumentException("Old password is incorrect");
        }
        if (!r.getNewPassword().equals(r.getConfirmPassword())) {
            throw new com.backend.exception.IllegalArgumentException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(r.getNewPassword()));
        userRepository.save(user);
    }
}
