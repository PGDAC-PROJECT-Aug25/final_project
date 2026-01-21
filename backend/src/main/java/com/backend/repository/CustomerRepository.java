package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {}
