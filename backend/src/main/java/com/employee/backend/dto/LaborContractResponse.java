package com.employee.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LaborContractResponse {

    private Long id;
    private Long employeeId;
    private String contractNumber;
    private String contractType;
    private LocalDate signedDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal basicSalary;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public LaborContractResponse(
            Long id,
            Long employeeId,
            String contractNumber,
            String contractType,
            LocalDate signedDate,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal basicSalary,
            String status,
            String notes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.employeeId = employeeId;
        this.contractNumber = contractNumber;
        this.contractType = contractType;
        this.signedDate = signedDate;
        this.startDate = startDate;
        this.endDate = endDate;
        this.basicSalary = basicSalary;
        this.status = status;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getContractNumber() {
        return contractNumber;
    }

    public String getContractType() {
        return contractType;
    }

    public LocalDate getSignedDate() {
        return signedDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BigDecimal getBasicSalary() {
        return basicSalary;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}