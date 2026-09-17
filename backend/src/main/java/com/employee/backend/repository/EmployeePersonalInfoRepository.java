package com.employee.backend.repository;

import com.employee.backend.entity.EmployeePersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeePersonalInfoRepository
        extends JpaRepository<EmployeePersonalInfo, Long> {

    Optional<EmployeePersonalInfo> findByEmployeeId(Long employeeId);

    boolean existsByEmployeeId(Long employeeId);
}