package com.employee.backend.controller;

import com.employee.backend.entity.Department;
import com.employee.backend.service.DepartmentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/corporation/{corporationId}")
    public List<Department> getDepartmentsByCorporation(
            @PathVariable Long corporationId
    ) {
        return departmentService
                .getActiveDepartmentsByCorporation(corporationId);
    }
}