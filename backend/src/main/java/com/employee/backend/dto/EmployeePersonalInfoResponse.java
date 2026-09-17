package com.employee.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeePersonalInfoResponse {

    private Long id;
    private Long employeeId;
    private LocalDate dateOfBirth;
    private String placeOfBirth;
    private String nationality;
    private String maritalStatus;
    private String phoneNumber;
    private String email;
    private String permanentAddress;
    private String currentAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeePersonalInfoResponse(
            Long id,
            Long employeeId,
            LocalDate dateOfBirth,
            String placeOfBirth,
            String nationality,
            String maritalStatus,
            String phoneNumber,
            String email,
            String permanentAddress,
            String currentAddress,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.employeeId = employeeId;
        this.dateOfBirth = dateOfBirth;
        this.placeOfBirth = placeOfBirth;
        this.nationality = nationality;
        this.maritalStatus = maritalStatus;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.permanentAddress = permanentAddress;
        this.currentAddress = currentAddress;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getPlaceOfBirth() {
        return placeOfBirth;
    }

    public String getNationality() {
        return nationality;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getPermanentAddress() {
        return permanentAddress;
    }

    public String getCurrentAddress() {
        return currentAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}