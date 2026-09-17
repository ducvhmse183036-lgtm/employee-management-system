package com.employee.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class FamilyMemberResponse {

    private Long id;
    private Long employeeId;
    private String fullName;
    private String relationship;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String occupation;
    private Boolean dependent;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FamilyMemberResponse(
            Long id,
            Long employeeId,
            String fullName,
            String relationship,
            LocalDate dateOfBirth,
            String gender,
            String phoneNumber,
            String occupation,
            Boolean dependent,
            String notes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.relationship = relationship;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.occupation = occupation;
        this.dependent = dependent;
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

    public String getFullName() {
        return fullName;
    }

    public String getRelationship() {
        return relationship;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getGender() {
        return gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getOccupation() {
        return occupation;
    }

    public Boolean getDependent() {
        return dependent;
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