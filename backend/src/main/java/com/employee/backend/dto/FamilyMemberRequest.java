package com.employee.backend.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class FamilyMemberRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    private LocalDate dateOfBirth;

    private String gender;

    private String phoneNumber;

    private String occupation;

    private Boolean dependent;

    private String notes;

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

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public void setDependent(Boolean dependent) {
        this.dependent = dependent;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}