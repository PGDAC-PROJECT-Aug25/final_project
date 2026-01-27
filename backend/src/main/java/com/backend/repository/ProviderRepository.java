package com.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.ServiceProvider;
import com.backend.entity.User;

public interface ProviderRepository extends JpaRepository<ServiceProvider, Long> {

	Optional<ServiceProvider> findByUserId(Long userId);}

