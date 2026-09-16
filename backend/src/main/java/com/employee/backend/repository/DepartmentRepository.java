package com.employee.backend.repository;

import com.employee.backend.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

    List<Department> findByCorporationIdAndActiveOrderByNameAsc(
            Long corporationId,
            Boolean active
    );
}