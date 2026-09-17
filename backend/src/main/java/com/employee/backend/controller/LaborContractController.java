package com.employee.backend.controller;

import com.employee.backend.dto.LaborContractRequest;
import com.employee.backend.dto.LaborContractResponse;
import com.employee.backend.service.LaborContractService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/{employeeId}/labor-contracts")
public class LaborContractController {

    private final LaborContractService laborContractService;

    public LaborContractController(
            LaborContractService laborContractService) {

        this.laborContractService = laborContractService;
    }

    @GetMapping
    public List<LaborContractResponse> getContracts(
            @PathVariable Long employeeId) {

        return laborContractService.getByEmployeeId(employeeId);
    }

    @PostMapping
    public ResponseEntity<LaborContractResponse> createContract(
            @PathVariable Long employeeId,
            @Valid @RequestBody LaborContractRequest request) {

        LaborContractResponse created =
                laborContractService.create(employeeId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping("/{contractId}")
    public LaborContractResponse updateContract(
            @PathVariable Long employeeId,
            @PathVariable Long contractId,
            @Valid @RequestBody LaborContractRequest request) {

        return laborContractService.update(
                employeeId,
                contractId,
                request
        );
    }
}