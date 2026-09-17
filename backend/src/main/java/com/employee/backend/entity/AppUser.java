package com.employee.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", schema = "dbo")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "is_active", nullable = false)
    private Boolean active;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Long getRoleId() {
        return roleId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public Boolean getActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}