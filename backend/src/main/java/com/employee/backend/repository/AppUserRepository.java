package com.employee.backend.repository;

import com.employee.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUserId(String userId);

    boolean existsByUserId(String userId);
}