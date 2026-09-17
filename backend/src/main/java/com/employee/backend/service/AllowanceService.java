package com.employee.backend.service;

import com.employee.backend.dto.AllowanceRequest;
import com.employee.backend.dto.AllowanceResponse;
import com.employee.backend.entity.Allowance;
import com.employee.backend.repository.AllowanceRepository;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AllowanceService {

    private final AllowanceRepository allowanceRepository;
    private final EmployeeRepository employeeRepository;

    public AllowanceService(
            AllowanceRepository allowanceRepository,
            EmployeeRepository employeeRepository) {

        this.allowanceRepository = allowanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<AllowanceResponse> getByEmployeeId(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        return allowanceRepository
                .findByEmployeeIdOrderByEffectiveFromDesc(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AllowanceResponse create(
            Long employeeId,
            AllowanceRequest request) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        Allowance allowance = new Allowance();

        allowance.setEmployeeId(employeeId);

        updateFields(allowance, request);

        if (allowance.getStatus() == null ||
                allowance.getStatus().isBlank()) {

            allowance.setStatus("ACTIVE");
        }

        Allowance saved =
                allowanceRepository.save(allowance);

        return toResponse(saved);
    }

    public AllowanceResponse update(
            Long employeeId,
            Long allowanceId,
            AllowanceRequest request) {

        Allowance allowance =
                allowanceRepository.findById(allowanceId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Allowance not found"
                                )
                        );

        if (!allowance.getEmployeeId().equals(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Allowance not found for this employee"
            );
        }

        updateFields(allowance, request);

        if (allowance.getStatus() == null ||
                allowance.getStatus().isBlank()) {

            allowance.setStatus("ACTIVE");
        }

        allowance.setUpdatedAt(LocalDateTime.now());

        Allowance saved =
                allowanceRepository.save(allowance);

        return toResponse(saved);
    }

    private void updateFields(
            Allowance allowance,
            AllowanceRequest request) {

        allowance.setAllowanceType(request.getAllowanceType());
        allowance.setAmount(request.getAmount());
        allowance.setEffectiveFrom(request.getEffectiveFrom());
        allowance.setEffectiveTo(request.getEffectiveTo());
        allowance.setStatus(request.getStatus());
        allowance.setNotes(request.getNotes());
    }

    private AllowanceResponse toResponse(
            Allowance allowance) {

        return new AllowanceResponse(
                allowance.getId(),
                allowance.getEmployeeId(),
                allowance.getAllowanceType(),
                allowance.getAmount(),
                allowance.getEffectiveFrom(),
                allowance.getEffectiveTo(),
                allowance.getStatus(),
                allowance.getNotes(),
                allowance.getCreatedAt(),
                allowance.getUpdatedAt()
        );
    }
}