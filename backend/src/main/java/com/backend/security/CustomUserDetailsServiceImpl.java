package com.backend.security;




import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.entity.User;
import com.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomUserDetailsServiceImpl implements UserDetailsService{

	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       
		User user = userRepository.findByEmail(email)
				.orElseThrow(()->new UsernameNotFoundException("User by this email doesn't exist!"));
		
		
		return new UserPrincipal(user.getId(),
				user.getEmail(),user.getPassword(),
				List.of(new SimpleGrantedAuthority(user.getRole().name())),user.getRole().name());
	}

}
