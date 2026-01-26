package com.backend.service.impl;

import java.security.Provider;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.backend.dto.AddBusRequest;
import com.backend.dto.AddScheduleRequest;
import com.backend.dto.ProviderDashboardBusResponse;
import com.backend.dto.ProviderScheduleResponse;
import com.backend.dto.SearchBusResponse;
import com.backend.dto.SeatResponse;
import com.backend.dto.UpdateBusRequest;
import com.backend.entity.Bus;
import com.backend.entity.BusRoute;
import com.backend.entity.BusSchedule;
import com.backend.entity.BusSeat;
import com.backend.entity.BusStatus;
import com.backend.entity.BusType;
import com.backend.entity.ScheduleStatus;
import com.backend.entity.ServiceProvider;
import com.backend.exception.DuplicateResourceException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.BusRepository;
import com.backend.repository.BusRouteRepository;
import com.backend.repository.BusScheduleRepository;
import com.backend.repository.BusSeatRepository;
import com.backend.repository.ProviderRepository;
import com.backend.service.BusService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final ProviderRepository providerRepository;
    private final BusRouteRepository routeRepository;
    private final BusScheduleRepository scheduleRepository;
    private final BusSeatRepository seatRepository;
    private final ModelMapper modelMapper;

    @Override
    public void addBus(Long providerId, AddBusRequest request) {

        ServiceProvider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));
        
        if (busRepository.existsByProviderIdAndBusNumber(providerId, request.getBusNumber())) {
            throw new DuplicateResourceException("Bus with this number already exists for this provider");
        }


        Bus bus = modelMapper.map(request, Bus.class);
        bus.setProvider(provider);
        bus.setBusType(BusType.valueOf(request.getBusType().toUpperCase()));

        busRepository.save(bus);
    }
    
    
    
    
    
    @Override
    public void addSchedule(Long providerId, AddScheduleRequest request) {
    	
    	

        ServiceProvider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

        if (!bus.getProvider().getId().equals(provider.getId())) {
            throw new ResourceNotFoundException("Bus does not belong to this provider");
        }
        
        if (scheduleRepository.existsByBusIdAndTravelDateAndDepartureTime(
    	        bus.getId(),
    	        LocalDate.parse(request.getTravelDate()),
    	        LocalDateTime.parse(request.getDepartureTime()))) {

    	    throw new DuplicateResourceException("Schedule already exists for this bus at the given time");
    	}


        // Find or create route
        BusRoute route = routeRepository
                .findBySourceIgnoreCaseAndDestinationIgnoreCase(
                        request.getSource(), request.getDestination())
                .orElseGet(() -> {
                    BusRoute r = new BusRoute();
                    r.setSource(request.getSource());
                    r.setDestination(request.getDestination());
                    return routeRepository.save(r);
                });

        // Create schedule
        BusSchedule schedule = new BusSchedule();
        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setTravelDate(LocalDate.parse(request.getTravelDate()));
        schedule.setDepartureTime(LocalDateTime.parse(request.getDepartureTime()));
        schedule.setArrivalTime(LocalDateTime.parse(request.getArrivalTime()));
        schedule.setPrice(request.getPrice());

        schedule = scheduleRepository.save(schedule);

        // Auto-generate seats
        List<BusSeat> seats = new ArrayList<>();
        for (int i = 1; i <= bus.getTotalSeats(); i++) {
            BusSeat seat = new BusSeat();
            seat.setSchedule(schedule);
            seat.setSeatNumber("S" + i);
            seats.add(seat);
        }

        seatRepository.saveAll(seats);
    }
    
    @Override
    public List<SearchBusResponse> searchBuses(String from, String to, String date) {

        if (from == null || to == null || date == null) {
            throw new IllegalArgumentException("From, To and Date are required");
        }

        LocalDate travelDate = LocalDate.parse(date);

        List<BusSchedule> schedules =
                scheduleRepository.searchSchedules(from, to, travelDate);
        if (schedules.isEmpty()) {
            throw new ResourceNotFoundException("No buses found for given route and date");
        }
        return schedules.stream().map(s -> {

        	 long availableSeats =
        	            seatRepository.countByScheduleIdAndIsBookedFalse(s.getId());
            return new SearchBusResponse(
                    s.getId(),
                    s.getBus().getBusNumber(),
                    s.getBus().getBusType().name(),
                    s.getRoute().getSource(),
                    s.getRoute().getDestination(),
                    s.getDepartureTime().toString(),
                    s.getArrivalTime().toString(),
                    s.getPrice(),
                    availableSeats
            );
        }).toList();
    }
    
    
    
    @Override
    public List<SeatResponse> getSeatsBySchedule(Long scheduleId) {

        // ensure schedule exists
        scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

        return seatRepository.findByScheduleIdOrderBySeatNumber(scheduleId)
                .stream()
                .map(seat -> new SeatResponse(
                        seat.getSeatNumber(),
                        seat.getIsBooked()
                ))
                .toList();
    }
    
    
    
    
    @Override
    public List<ProviderDashboardBusResponse> getProviderDashboard(Long providerId) {

        providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));

        List<Bus> buses = busRepository.findByProviderId(providerId);
        List<ProviderDashboardBusResponse> result = new ArrayList<>();

        for (Bus bus : buses) {

            ProviderDashboardBusResponse busDto = new ProviderDashboardBusResponse();
            busDto.setBusId(bus.getId());
            busDto.setBusNumber(bus.getBusNumber());
            busDto.setBusType(bus.getBusType().name());
            busDto.setTotalSeats(bus.getTotalSeats());
            busDto.setStatus(bus.getStatus().name());

            List<BusSchedule> schedules = scheduleRepository.findByBusId(bus.getId());
            List<ProviderScheduleResponse> scheduleDtos = new ArrayList<>();

            for (BusSchedule s : schedules) {
                long available =
                        seatRepository.countByScheduleIdAndIsBookedFalse(s.getId());

                scheduleDtos.add(new ProviderScheduleResponse(
                        s.getId(),
                        s.getRoute().getSource(),
                        s.getRoute().getDestination(),
                        s.getTravelDate().toString(),
                        s.getDepartureTime().toLocalTime().toString(),
                        s.getArrivalTime().toLocalTime().toString(),
                        s.getPrice(),
                        s.getStatus().name(),
                        available
                ));
            }

            busDto.setSchedules(scheduleDtos);
            result.add(busDto);
        }

        return result;
    }





	@Override
	public void updateBus(Long providerId, Long busId, UpdateBusRequest request) {
		
		  ServiceProvider provider =  providerRepository.findById(providerId)
				              .orElseThrow(() -> new ResourceNotFoundException("Provider doesnt exist"));
		  
		  Bus bus = busRepository.findById(busId)
				  .orElseThrow(() -> new ResourceNotFoundException("Bus doesnt exist"));
		  
		  
		  if(!bus.getProvider().getId().equals(provider.getId()))
			  throw new ResourceNotFoundException("Bus does not belong to provider");
		  
		  if(!bus.getBusNumber().equalsIgnoreCase(request.getBusNumber())  
				  && busRepository.existsByProviderIdAndBusNumber(providerId, request.getBusNumber()))
		  {
			  throw new DuplicateResourceException("Bus with this number already exists");
		  }
		  
		 // Bus newbus = modelMapper.map(request, Bus.class);
		    bus.setBusNumber(request.getBusNumber());
		    bus.setBusType(BusType.valueOf(request.getBusType().toUpperCase()));
		    bus.setTotalSeats(request.getTotalSeats());
		  
		  busRepository.save(bus);
				  
		
	}





	@Override
	public void changeBusStatus(Long providerId, Long busId, String status) {
		ServiceProvider provider = providerRepository.findById(providerId)
	            .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));

	    Bus bus = busRepository.findById(busId)
	            .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

	    if (!bus.getProvider().getId().equals(provider.getId())) {
	        throw new ResourceNotFoundException("Bus does not belong to this provider");
	    }
	    
	    BusStatus newStatus;
	    try {
	        newStatus = BusStatus.valueOf(status.toUpperCase());
	    } catch (IllegalArgumentException ex) {
	        throw new IllegalArgumentException("Invalid status. Use ACTIVE or INACTIVE");
	    }

	    bus.setStatus(newStatus);
	    busRepository.save(bus);
		
	}





	@Override
	public void cancelSchedule(Long providerId, Long scheduleId) {
		ServiceProvider provider = providerRepository.findById(providerId)
	            .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found"));

	    BusSchedule schedule = scheduleRepository.findById(scheduleId)
	            .orElseThrow(() -> new ResourceNotFoundException("Schedule not found"));

	    if (!schedule.getBus().getProvider().getId().equals(provider.getId())) {
	        throw new ResourceNotFoundException("Schedule does not belong to this provider");
	    }

	    if (schedule.getStatus() == ScheduleStatus.INACTIVE) {
	        throw new IllegalStateException("Schedule already cancelled");
	    }

	  
	    schedule.setStatus(ScheduleStatus.INACTIVE);

	    
	    List<BusSeat> seats = seatRepository.findByScheduleIdOrderBySeatNumber(scheduleId);
	    for (BusSeat seat : seats) {
	        seat.setIsBooked(false);
	    }
		
	}
     

    
    
    
}
