package com.employee.backend.service;

import com.employee.backend.dto.LaborContractRequest;
import com.employee.backend.dto.LaborContractResponse;
import com.employee.backend.entity.LaborContract;
import com.employee.backend.repository.EmployeeRepository;
import com.employee.backend.repository.LaborContractRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LaborContractService {

    private final LaborContractRepository laborContractRepository;
    private final EmployeeRepository employeeRepository;

    public LaborContractService(
            LaborContractRepository laborContractRepository,
            EmployeeRepository employeeRepository) {

        this.laborContractRepository = laborContractRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<LaborContractResponse> getByEmployeeId(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        return laborContractRepository
                .findByEmployeeIdOrderByStartDateDesc(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public LaborContractResponse create(
            Long employeeId,
            LaborContractRequest request) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        if (laborContractRepository.existsByContractNumber(
                request.getContractNumber())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Contract number already exists"
            );
        }

        LaborContract contract = new LaborContract();

        contract.setEmployeeId(employeeId);

        updateFields(contract, request);

        if (contract.getStatus() == null ||
                contract.getStatus().isBlank()) {
            contract.setStatus("ACTIVE");
        }

        LaborContract saved =
                laborContractRepository.save(contract);

        return toResponse(saved);
    }

    public LaborContractResponse update(
            Long employeeId,
            Long contractId,
            LaborContractRequest request) {

        LaborContract contract =
                laborContractRepository.findById(contractId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Labor contract not found"
                                )
                        );

        if (!contract.getEmployeeId().equals(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Labor contract not found for this employee"
            );
        }

        if (!contract.getContractNumber()
                .equals(request.getContractNumber())) {

            if (laborContractRepository.existsByContractNumber(
                    request.getContractNumber())) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Contract number already exists"
                );
            }
        }

        updateFields(contract, request);

        contract.setUpdatedAt(LocalDateTime.now());

        LaborContract saved =
                laborContractRepository.save(contract);

        return toResponse(saved);
    }

    private void updateFields(
            LaborContract contract,
            LaborContractRequest request) {

        contract.setContractNumber(request.getContractNumber());
        contract.setContractType(request.getContractType());
        contract.setSignedDate(request.getSignedDate());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setBasicSalary(request.getBasicSalary());
        contract.setStatus(request.getStatus());
        contract.setNotes(request.getNotes());
    }

    private LaborContractResponse toResponse(
            LaborContract contract) {

        return new LaborContractResponse(
                contract.getId(),
                contract.getEmployeeId(),
                contract.getContractNumber(),
                contract.getContractType(),
                contract.getSignedDate(),
                contract.getStartDate(),
                contract.getEndDate(),
                contract.getBasicSalary(),
                contract.getStatus(),
                contract.getNotes(),
                contract.getCreatedAt(),
                contract.getUpdatedAt()
        );
    }
}