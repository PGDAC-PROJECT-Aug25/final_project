package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.ServiceProvider;

public interface ProviderRepository extends JpaRepository<ServiceProvider, Long> {}

