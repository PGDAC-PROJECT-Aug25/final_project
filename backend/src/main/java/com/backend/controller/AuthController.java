package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.CustomerRegisterRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.ProviderRegisterRequest;
import com.backend.security.JwtUtils;
import com.backend.security.UserPrincipal;
import com.backend.service.AuthService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
	private final JwtUtils jwtUtils;

    @PostMapping("/register/customer")
    public ResponseEntity<String> registerCustomer(
            @Valid @RequestBody CustomerRegisterRequest request) {

        authService.registerCustomer(request);
        return ResponseEntity.ok("Customer registered successfully");
    }

    @PostMapping("/register/provider")
    public ResponseEntity<String> registerProvider(
            @Valid @RequestBody ProviderRegisterRequest request) {

        authService.registerProvider(request);
        return ResponseEntity.ok("Service Provider registered successfully");
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {
        
       // LoginResponse response = authService.login(request);
    	Authentication holder=new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
      
    	Authentication fullyAuth = authenticationManager.authenticate(holder);
    	
    	UserPrincipal principal=(UserPrincipal) fullyAuth.getPrincipal();
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", jwtUtils.generateToken(principal))
        );
    }

}

