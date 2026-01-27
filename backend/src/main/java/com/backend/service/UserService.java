package com.backend.service;

import com.backend.dto.ChangePasswordRequest;
import com.backend.dto.CustomerProfileResponse;
import com.backend.dto.ProviderProfileResponse;
import com.backend.dto.UpdateCustomerProfileRequest;
import com.backend.dto.UpdateProviderProfileRequest;

public interface UserService {

    
    CustomerProfileResponse getCustomerProfile(Long userId);

    void updateCustomerProfile(Long userId, UpdateCustomerProfileRequest request);

    
    ProviderProfileResponse getProviderProfile(Long userId);

    void updateProviderProfile(Long userId, UpdateProviderProfileRequest request);

   
    void changePassword(Long userId, ChangePasswordRequest request);
}
