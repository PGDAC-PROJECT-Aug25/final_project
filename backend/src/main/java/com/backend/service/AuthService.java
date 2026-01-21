package com.backend.service;

import com.backend.dto.CustomerRegisterRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.ProviderRegisterRequest;

public interface AuthService {
	 void registerCustomer(CustomerRegisterRequest request);
	 void registerProvider(ProviderRegisterRequest request);
	 
	 //Login
	 
	 LoginResponse login(LoginRequest request);
}
