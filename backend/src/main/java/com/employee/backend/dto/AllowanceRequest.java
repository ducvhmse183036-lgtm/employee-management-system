package com.employee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AllowanceRequest {

    @NotBlank(message = "Allowance type is required")
    private String allowanceType;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @NotNull(message = "Effective from is required")
    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;

    private String status;

    private String notes;

    public String getAllowanceType() {
        return allowanceType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getEffectiveFrom() {
        return effectiveFrom;
    }

    public LocalDate getEffectiveTo() {
        return effectiveTo;
    }

    public String getStatus() {
        return status;
    }

    public String getNotes() {
        return notes;
    }

    public void setAllowanceType(String allowanceType) {
        this.allowanceType = allowanceType;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setEffectiveFrom(LocalDate effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public void setEffectiveTo(LocalDate effectiveTo) {
        this.effectiveTo = effectiveTo;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}