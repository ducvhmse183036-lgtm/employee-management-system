package com.employee.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Password is required")
    private String password;

    public String getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}