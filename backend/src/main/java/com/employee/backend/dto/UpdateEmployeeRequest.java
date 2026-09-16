package com.employee.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class UpdateEmployeeRequest {

    @NotBlank(message = "Surname is required")
    private String surname;

    private String middleName;

    @NotBlank(message = "Given name is required")
    private String givenName;

    private String gender;

    private String identityCard;

    private String identityCardIssuePlace;

    private LocalDate identityCardIssueDate;

    private String status;

    @NotNull(message = "Department is required")
    private Long departmentId;

    private Long organizationUnitId;

    private String positionTitle;

    private LocalDate hireDate;

    private String photoUrl;

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getIdentityCard() {
        return identityCard;
    }

    public void setIdentityCard(String identityCard) {
        this.identityCard = identityCard;
    }

    public String getIdentityCardIssuePlace() {
        return identityCardIssuePlace;
    }

    public void setIdentityCardIssuePlace(String identityCardIssuePlace) {
        this.identityCardIssuePlace = identityCardIssuePlace;
    }

    public LocalDate getIdentityCardIssueDate() {
        return identityCardIssueDate;
    }

    public void setIdentityCardIssueDate(LocalDate identityCardIssueDate) {
        this.identityCardIssueDate = identityCardIssueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getOrganizationUnitId() {
        return organizationUnitId;
    }

    public void setOrganizationUnitId(Long organizationUnitId) {
        this.organizationUnitId = organizationUnitId;
    }

    public String getPositionTitle() {
        return positionTitle;
    }

    public void setPositionTitle(String positionTitle) {
        this.positionTitle = positionTitle;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}