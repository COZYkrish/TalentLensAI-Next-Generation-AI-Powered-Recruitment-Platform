package com.talentlens.service;

import com.talentlens.dto.AuthResponse;
import com.talentlens.dto.LoginRequest;
import com.talentlens.dto.RegisterRequest;
import com.talentlens.entity.Role;
import com.talentlens.entity.User;
import com.talentlens.repository.UserRepository;
import com.talentlens.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final com.talentlens.repository.CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getRole().name());
    }

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        Role userRole = Role.CANDIDATE;
        if ("RECRUITER".equalsIgnoreCase(registerRequest.getRole())) {
            userRole = Role.RECRUITER;
        }

        com.talentlens.entity.Company company = null;
        if (userRole == Role.RECRUITER) {
            company = com.talentlens.entity.Company.builder()
                    .name(registerRequest.getName() + " Company")
                    .website("https://example.com")
                    .build();
            company = companyRepository.save(company);
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(userRole)
                .company(company)
                .build();

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
    }
}
