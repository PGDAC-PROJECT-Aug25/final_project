package com.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityBeansConfig {

    private final PasswordEncoder passwordEncoder;
    private final CustomJwtVerificationFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(csrf -> csrf.disable());

        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(request -> request

                // ---- Public Endpoints ----
                .requestMatchers(
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/auth/register/customer",
                        "/auth/register/provider",
                        "/auth/login"
                ).permitAll()

                // Public search
                .requestMatchers(HttpMethod.GET, "/buses/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/schedules/*/seats").permitAll()

                // ---- Customer ----
                .requestMatchers("/bookings/**").hasRole("CUSTOMER")
                .requestMatchers("/users/customer-profile").hasRole("CUSTOMER")

                // ---- Provider ----
                .requestMatchers("/provider/**").hasRole("PROVIDER")
                .requestMatchers("/users/provider-profile").hasRole("PROVIDER")

                // ---- Common (Customer + Provider + Admin) ----
                .requestMatchers("/users/change-password")
                .hasAnyRole("CUSTOMER", "PROVIDER", "ADMIN")

                // ---- Admin ----
                .requestMatchers("/admin/**").hasRole("ADMIN")

                // Everything else must be authenticated
                .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
