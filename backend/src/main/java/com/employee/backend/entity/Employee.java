package com.employee.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees", schema = "dbo")
public class Employee {
    public Long getId() {
        return id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public String getSurname() {
        return surname;
    }

    public String getMiddleName() {
        return middleName;
    }

    public String getGivenName() {
        return givenName;
    }

    public String getGender() {
        return gender;
    }

    public String getIdentityCard() {
        return identityCard;
    }

    public String getIdentityCardIssuePlace() {
        return identityCardIssuePlace;
    }

    public LocalDate getIdentityCardIssueDate() {
        return identityCardIssueDate;
    }

    public String getStatus() {
        return status;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public Long getOrganizationUnitId() {
        return organizationUnitId;
    }

    public String getPositionTitle() {
        return positionTitle;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_code", nullable = false, unique = true)
    private String employeeCode;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "given_name", nullable = false)
    private String givenName;

    @Column(name = "gender")
    private String gender;

    @Column(name = "identity_card")
    private String identityCard;

    @Column(name = "identity_card_issue_place")
    private String identityCardIssuePlace;

    @Column(name = "identity_card_issue_date")
    private LocalDate identityCardIssueDate;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "organization_unit_id")
    private Long organizationUnitId;

    @Column(name = "position_title")
    private String positionTitle;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}