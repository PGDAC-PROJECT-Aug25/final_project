package com.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bus_schedules")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "schedule_id"))
public class BusSchedule extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private BusRoute route;

    @Column(name = "departure_time")
    private LocalDateTime departureTime;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "travel_date")
    private LocalDate travelDate;

    @Column(name = "price")
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ScheduleStatus status = ScheduleStatus.ACTIVE;

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL)
    private List<BusSeat> seats;
}

