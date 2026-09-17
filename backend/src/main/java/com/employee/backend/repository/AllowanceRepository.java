package com.employee.backend.repository;

import com.employee.backend.entity.Allowance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllowanceRepository
        extends JpaRepository<Allowance, Long> {

    List<Allowance> findByEmployeeIdOrderByEffectiveFromDesc(Long employeeId);
}