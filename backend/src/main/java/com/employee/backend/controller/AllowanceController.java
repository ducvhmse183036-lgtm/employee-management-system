package com.employee.backend.controller;

import com.employee.backend.dto.AllowanceRequest;
import com.employee.backend.dto.AllowanceResponse;
import com.employee.backend.service.AllowanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/{employeeId}/allowances")
public class AllowanceController {

    private final AllowanceService allowanceService;

    public AllowanceController(
            AllowanceService allowanceService) {

        this.allowanceService = allowanceService;
    }

    @GetMapping
    public List<AllowanceResponse> getAllowances(
            @PathVariable Long employeeId) {

        return allowanceService.getByEmployeeId(employeeId);
    }

    @PostMapping
    public ResponseEntity<AllowanceResponse> createAllowance(
            @PathVariable Long employeeId,
            @Valid @RequestBody AllowanceRequest request) {

        AllowanceResponse created =
                allowanceService.create(employeeId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping("/{allowanceId}")
    public AllowanceResponse updateAllowance(
            @PathVariable Long employeeId,
            @PathVariable Long allowanceId,
            @Valid @RequestBody AllowanceRequest request) {

        return allowanceService.update(
                employeeId,
                allowanceId,
                request
        );
    }
}