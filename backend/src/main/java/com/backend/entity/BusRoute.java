package com.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "bus_routes")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "route_id"))
public class BusRoute extends BaseEntity {

    @Column(name = "source", length = 150)
    private String source;

    @Column(name = "destination", length = 150)
    private String destination;

    @Column(name = "distance_km")
    private Double distanceKm;

    @OneToMany(mappedBy = "route")
    private List<BusSchedule> schedules;
}
