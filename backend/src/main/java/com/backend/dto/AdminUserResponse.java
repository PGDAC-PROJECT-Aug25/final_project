package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminUserResponse {

    private Long userId;
    private String name;
    private String email;
    private String role;
    private Boolean isActive;
    private Boolean emailVerified;

    // --- New fields for Provider ---
    private Long providerId;
    private Boolean isProviderVerified;
}
