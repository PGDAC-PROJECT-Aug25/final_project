package com.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "buses")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "bus_id"))
public class Bus extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private ServiceProvider provider;

    @Column(name = "bus_number", length = 50)
    private String busNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "bus_type")
    private BusType busType;
    
    @Column(name = "total_seats")
    private Integer totalSeats;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private BusStatus status = BusStatus.ACTIVE;

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL)
    private List<BusSchedule> schedules;
}
