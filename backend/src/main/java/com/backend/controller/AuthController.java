package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backend.dto.CustomerRegisterRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.ProviderRegisterRequest;
import com.backend.entity.ServiceProvider;
import com.backend.entity.User;
import com.backend.exception.IllegalStateException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.ProviderRepository;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtils;
import com.backend.security.UserPrincipal;
import com.backend.service.AuthService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final ProviderRepository providerRepository;
    private final UserRepository userRepository;

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

        Authentication holder =
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword());

        Authentication fullyAuth = authenticationManager.authenticate(holder);

        UserPrincipal principal = (UserPrincipal) fullyAuth.getPrincipal();
        
        User user = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new IllegalStateException("Your account has been deactivated. Please contact admin.");
        }
       

        //PROVIDER VERIFICATION CHECK
        if ("ROLE_PROVIDER".equals(principal.getUserRole())) {
        	System.out.println("******************"+principal.getUserRole());
            ServiceProvider provider = providerRepository
                    .findByUserId(principal.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));

            if (!Boolean.TRUE.equals(provider.getVerified())) {
                throw new IllegalStateException("Your account is not verified by admin yet");
            }
        }

        String token = jwtUtils.generateToken(principal);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Login successful", token)
        );
    }
}
