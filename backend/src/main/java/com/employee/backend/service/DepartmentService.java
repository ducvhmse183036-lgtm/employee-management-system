package com.employee.backend.service;

import com.employee.backend.entity.Department;
import com.employee.backend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getActiveDepartmentsByCorporation(Long corporationId) {
        return departmentRepository
                .findByCorporationIdAndActiveOrderByNameAsc(
                        corporationId,
                        true
                );
    }
}