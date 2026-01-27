package com.backend.service;

import com.backend.dto.DummyPaymentRequest;

public interface PaymentService {
    void pay(DummyPaymentRequest request,Long userId);
}
