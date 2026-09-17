package com.employee.backend.controller;

import com.employee.backend.dto.EmployeePersonalInfoRequest;
import com.employee.backend.dto.EmployeePersonalInfoResponse;
import com.employee.backend.service.EmployeePersonalInfoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees/{employeeId}/personal-info")
public class EmployeePersonalInfoController {

    private final EmployeePersonalInfoService personalInfoService;

    public EmployeePersonalInfoController(
            EmployeePersonalInfoService personalInfoService) {

        this.personalInfoService = personalInfoService;
    }

    @GetMapping
    public EmployeePersonalInfoResponse getPersonalInfo(
            @PathVariable Long employeeId) {

        return personalInfoService.getByEmployeeId(employeeId);
    }

    @PostMapping
    public ResponseEntity<EmployeePersonalInfoResponse> createPersonalInfo(
            @PathVariable Long employeeId,
            @RequestBody EmployeePersonalInfoRequest request) {

        EmployeePersonalInfoResponse created =
                personalInfoService.create(employeeId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping
    public EmployeePersonalInfoResponse updatePersonalInfo(
            @PathVariable Long employeeId,
            @RequestBody EmployeePersonalInfoRequest request) {

        return personalInfoService.update(employeeId, request);
    }
}