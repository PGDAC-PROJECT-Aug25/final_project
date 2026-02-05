package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AdminUserResponse {
<<<<<<< HEAD

    private Long userId;
=======
    private Long  userId;
>>>>>>> 28518f940a4d2252052a68634023d2daf07a7ddf
    private String name;
    private String  email;
    private String  role;
    private Boolean isActive;
<<<<<<< HEAD
    private Boolean emailVerified;

    // --- New fields for Provider ---
    private Long providerId;
    private Boolean isProviderVerified;
=======
    private Boolean  emailVerified;
>>>>>>> 28518f940a4d2252052a68634023d2daf07a7ddf
}
