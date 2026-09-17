package com.employee.backend.repository;

import com.employee.backend.entity.LaborContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LaborContractRepository
        extends JpaRepository<LaborContract, Long> {

    List<LaborContract> findByEmployeeIdOrderByStartDateDesc(Long employeeId);

    Optional<LaborContract> findByContractNumber(String contractNumber);

    boolean existsByContractNumber(String contractNumber);
}