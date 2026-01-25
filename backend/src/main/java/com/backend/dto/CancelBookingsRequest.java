package com.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CancelBookingsRequest {

    @NotEmpty
    private List<Long> bookingIds;
}
