package com.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeBusStatusRequest {

    @NotBlank
    private String status;   // ACTIVE or INACTIVE
}
