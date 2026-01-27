package com.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DummyPaymentRequest {

    @NotEmpty
    private List<Long> bookingIds;

    @NotNull
    private Double amount;
}
