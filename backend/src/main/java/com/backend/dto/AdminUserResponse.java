package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long  userId;
    private String name;
    private String  email;
    private String  role;
    private Boolean isActive;
    private Boolean  emailVerified;

    private Long providerId;
    private Boolean isProviderVerified;
}
