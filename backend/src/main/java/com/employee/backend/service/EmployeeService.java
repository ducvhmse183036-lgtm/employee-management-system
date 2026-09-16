package com.employee.backend.service;

import com.employee.backend.dto.CreateEmployeeRequest;
import com.employee.backend.entity.Employee;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.employee.backend.dto.UpdateEmployeeRequest;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findByStatus("ACTIVE");
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );
    }
    public Employee createEmployee(CreateEmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Employee code already exists"
            );
        }
        Employee employee = new Employee();

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setSurname(request.getSurname());
        employee.setMiddleName(request.getMiddleName());
        employee.setGivenName(request.getGivenName());
        employee.setGender(request.getGender());

        employee.setIdentityCard(request.getIdentityCard());
        employee.setIdentityCardIssuePlace(request.getIdentityCardIssuePlace());
        employee.setIdentityCardIssueDate(request.getIdentityCardIssueDate());

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            employee.setStatus("ACTIVE");
        } else {
            employee.setStatus(request.getStatus());
        }

        employee.setDepartmentId(request.getDepartmentId());
        employee.setOrganizationUnitId(request.getOrganizationUnitId());

        employee.setPositionTitle(request.getPositionTitle());
        employee.setHireDate(request.getHireDate());
        employee.setPhotoUrl(request.getPhotoUrl());

        return employeeRepository.save(employee);
    }
    public Employee updateEmployee(Long id, UpdateEmployeeRequest request) {

        Employee employee = getEmployeeById(id);

        employee.setSurname(request.getSurname());
        employee.setMiddleName(request.getMiddleName());
        employee.setGivenName(request.getGivenName());
        employee.setGender(request.getGender());

        employee.setIdentityCard(request.getIdentityCard());
        employee.setIdentityCardIssuePlace(request.getIdentityCardIssuePlace());
        employee.setIdentityCardIssueDate(request.getIdentityCardIssueDate());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            employee.setStatus(request.getStatus());
        }

        employee.setDepartmentId(request.getDepartmentId());
        employee.setOrganizationUnitId(request.getOrganizationUnitId());

        employee.setPositionTitle(request.getPositionTitle());
        employee.setHireDate(request.getHireDate());
        employee.setPhotoUrl(request.getPhotoUrl());

        employee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(employee);
    }
    public Employee deleteEmployee(Long id) {

        Employee employee = getEmployeeById(id);

        employee.setStatus("INACTIVE");
        employee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(employee);
    }
    public Employee searchByEmployeeCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );
    }
    public List<Employee> searchEmployees(String keyword) {
        return employeeRepository.searchActiveEmployees(keyword);
    }
    public List<Employee> getEmployeesByDepartment(Long departmentId) {
        return employeeRepository.findByStatusAndDepartmentId(
                "ACTIVE",
                departmentId
        );
    }
    public List<Employee> getEmployeesByOrganizationUnit(Long organizationUnitId) {
        return employeeRepository.findByStatusAndOrganizationUnitId(
                "ACTIVE",
                organizationUnitId
        );
    }
}