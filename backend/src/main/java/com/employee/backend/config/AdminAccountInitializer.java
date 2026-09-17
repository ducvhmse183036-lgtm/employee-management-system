package com.employee.backend.config;

import com.employee.backend.entity.AppUser;
import com.employee.backend.entity.Role;
import com.employee.backend.repository.AppUserRepository;
import com.employee.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminAccountInitializer {

    @Bean
    public CommandLineRunner createInitialAdmin(
            AppUserRepository appUserRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String userId = System.getenv("ADMIN_USER_ID");
            String password = System.getenv("ADMIN_PASSWORD");

            if (userId == null || password == null) {
                System.out.println("ADMIN_USER_ID or ADMIN_PASSWORD is not configured.");
                return;
            }

            if (appUserRepository.existsByUserId(userId)) {
                System.out.println("Initial admin account already exists.");
                return;
            }

            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() ->
                            new IllegalStateException("ADMIN role not found"));

            AppUser admin = new AppUser();

            admin.setUserId(userId);
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRoleId(adminRole.getId());
            admin.setEmployeeId(null);
            admin.setActive(true);

            appUserRepository.save(admin);

            System.out.println("Initial ADMIN account created successfully.");
        };
    }
}