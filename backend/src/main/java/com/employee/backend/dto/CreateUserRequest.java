package com.employee.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateUserRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    private Long employeeId;

    public String getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }
}