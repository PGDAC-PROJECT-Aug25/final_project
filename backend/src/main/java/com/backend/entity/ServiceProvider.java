package com.backend.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "service_providers")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "provider_id"))
public class ServiceProvider extends BaseEntity {

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "business_name", length = 150)
    private String businessName;

    @Column(name = "contact_number", length = 50)
    private String contactNumber;
    
    @Column(name = "gst_number")
    private String gstNumber;

    @Column(name = "company_address")
    private String companyAddress;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "verified")
    private Boolean verified = false;

    
}

