package com.backend.security;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Component 

public class JwtUtils {
	
	
	@Value("${jwt.expiration.time}")
	private long jwtExpirationTime;
	
	@Value("${jwt.secret}")
	private String jwtSecret;
	
	private SecretKey secretKey;
	
	@PostConstruct
	public void myInit()
	{
		secretKey=Keys.hmacShaKeyFor(jwtSecret.getBytes());		
	}
	
	
	
	//create JWT - header , payload, signature
	public String generateToken(UserPrincipal principal) {
		 
		Date now=new Date();
		
		Date expiresAt=new Date(now.getTime()+jwtExpirationTime);
		
		return Jwts.builder() 
				.subject(principal.getEmail()) //setting subject
				.issuedAt(now) //iat
				.expiration(expiresAt) //exp
				
				.claims(Map.of("user_id", principal.getUserId()
						, "user_role", principal.getUserRole()))
				.signWith(secretKey)//sign the JWT
				.compact();
				
	}
	public Claims validateToken(String jwt) {
		return Jwts.parser() //attach a parser
				.verifyWith(secretKey)
				.build() //builds JwtsParser
				.parseSignedClaims(jwt)
				.getPayload();
	}

}
