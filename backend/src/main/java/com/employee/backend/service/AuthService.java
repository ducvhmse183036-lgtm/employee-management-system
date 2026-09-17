package com.employee.backend.service;

import com.employee.backend.dto.LoginRequest;
import com.employee.backend.dto.LoginResponse;
import com.employee.backend.entity.AppUser;
import com.employee.backend.entity.Role;
import com.employee.backend.repository.AppUserRepository;
import com.employee.backend.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository appUserRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.appUserRepository = appUserRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        AppUser user = appUserRepository.findByUserId(request.getUserId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid user ID or password"
                        )
                );

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Account is inactive"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid user ID or password"
            );
        }

        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.INTERNAL_SERVER_ERROR,
                                "User role not found"
                        )
                );

        String token = jwtService.generateToken(
                user.getUserId(),
                role.getName()
        );

        return new LoginResponse(
                user.getUserId(),
                role.getName(),
                user.getEmployeeId(),
                token
        );
    }
}