package com.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "bus_seats")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "seat_id"))
public class BusSeat extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "schedule_id", nullable = false)
    private BusSchedule schedule;

    @Column(name = "seat_number", length = 10)
    private String seatNumber;

    @Column(name = "is_booked")
    private Boolean isBooked = false;
}
