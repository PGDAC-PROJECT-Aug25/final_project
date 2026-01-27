package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.DummyPaymentRequest;
import com.backend.dto.JwtDTO;
import com.backend.service.PaymentService;
import com.backend.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/pay")
    public ResponseEntity<?> pay(
            @Valid @RequestBody DummyPaymentRequest request) {

        JwtDTO dto = (JwtDTO) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();

        paymentService.pay(request, dto.getUserId());

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Payment successful", null)
        );
    }
}

