package com.employee.backend.controller;

import com.employee.backend.dto.CreateEmployeeRequest;
import com.employee.backend.entity.Employee;
import com.employee.backend.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.employee.backend.dto.UpdateEmployeeRequest;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }
    @PostMapping
    public Employee createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request
    ) {
        return employeeService.createEmployee(request);
    }
    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest request
    ) {
        return employeeService.updateEmployee(id, request);
    }
    @DeleteMapping("/{id}")
    public Employee deleteEmployee(@PathVariable Long id) {
        return employeeService.deleteEmployee(id);
    }
    @GetMapping("/search")
    public List<Employee> searchEmployees(
            @RequestParam String keyword
    ) {
        return employeeService.searchEmployees(keyword);
    }
    @GetMapping("/department/{departmentId}")
    public List<Employee> getEmployeesByDepartment(
            @PathVariable Long departmentId
    ) {
        return employeeService.getEmployeesByDepartment(departmentId);
    }
    @GetMapping("/organization-unit/{organizationUnitId}")
    public List<Employee> getEmployeesByOrganizationUnit(
            @PathVariable Long organizationUnitId
    ) {
        return employeeService.getEmployeesByOrganizationUnit(organizationUnitId);
    }
}