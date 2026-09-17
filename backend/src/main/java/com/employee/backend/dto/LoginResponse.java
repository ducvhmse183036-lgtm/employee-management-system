package com.employee.backend.dto;

public class LoginResponse {

    private String userId;
    private String role;
    private Long employeeId;
    private String token;

    public LoginResponse(
            String userId,
            String role,
            Long employeeId,
            String token) {

        this.userId = userId;
        this.role = role;
        this.employeeId = employeeId;
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getToken() {
        return token;
    }
}