package com.backend.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@SuppressWarnings("serial")
@RequiredArgsConstructor
@Getter
@Setter
@ToString
public class UserPrincipal implements UserDetails {

	private final Long userId;
	private final String email ;
	private final String password;
	private final Collection<? extends GrantedAuthority> authorities;
	private final String userRole;
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.authorities;
	}
	
	@Override
	public String getUsername() {
		return this.email;
	}
	

}
