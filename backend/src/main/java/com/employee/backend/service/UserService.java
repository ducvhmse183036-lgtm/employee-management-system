package com.employee.backend.service;

import com.employee.backend.dto.CreateUserRequest;
import com.employee.backend.dto.UserResponse;
import com.employee.backend.entity.AppUser;
import com.employee.backend.entity.Role;
import com.employee.backend.repository.AppUserRepository;
import com.employee.backend.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            AppUserRepository appUserRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.appUserRepository = appUserRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(CreateUserRequest request) {

        if (appUserRepository.existsByUserId(request.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "User ID already exists"
            );
        }

        Role role = roleRepository.findByName(
                        request.getRole().toUpperCase()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Invalid role"
                        )
                );

        if (!Boolean.TRUE.equals(role.getActive())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Role is inactive"
            );
        }

        AppUser user = new AppUser();

        user.setUserId(request.getUserId());

        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRoleId(role.getId());
        user.setEmployeeId(request.getEmployeeId());
        user.setActive(true);

        AppUser savedUser = appUserRepository.save(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getUserId(),
                role.getName(),
                savedUser.getEmployeeId(),
                savedUser.getActive()
        );
    }
}