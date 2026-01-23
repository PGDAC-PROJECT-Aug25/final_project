package com.backend.service.impl;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.dto.CustomerRegisterRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.ProviderRegisterRequest;
import com.backend.entity.Customer;
import com.backend.entity.Role;
import com.backend.entity.ServiceProvider;
import com.backend.entity.User;
import com.backend.exception.DuplicateEmailException;
import com.backend.exception.InvalidCredentialsException;
import com.backend.repository.CustomerRepository;
import com.backend.repository.ProviderRepository;
import com.backend.repository.UserRepository;
import com.backend.service.AuthService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ProviderRepository providerRepository;
    private final ModelMapper modelMapper;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void registerCustomer(CustomerRegisterRequest request) {

    	if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

        
        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_CUSTOMER);

        user = userRepository.save(user);

       
        Customer customer = modelMapper.map(request, Customer.class);
        customer.setUser(user);
        customer.setDob(request.getDob());

        customerRepository.save(customer);
    }

    @Override
    public void registerProvider(ProviderRegisterRequest request) {

        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already exists");
        }

       
        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_PROVIDER);

        user = userRepository.save(user);

        // Map DTO → ServiceProvider
        ServiceProvider sp = modelMapper.map(request, ServiceProvider.class);
        sp.setUser(user);

        providerRepository.save(sp);
    }

	@Override
	public LoginResponse login(LoginRequest request) {

	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

	    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        throw new InvalidCredentialsException("Invalid email or password");
	    }

	    return new LoginResponse(
	            user.getId(),
	            user.getName(),
	            user.getRole().name()
	    );
	}

}
