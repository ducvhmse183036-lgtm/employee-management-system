package com.employee.backend.dto;

public class UserResponse {

    private Long id;
    private String userId;
    private String role;
    private Long employeeId;
    private Boolean active;

    public UserResponse(
            Long id,
            String userId,
            String role,
            Long employeeId,
            Boolean active) {

        this.id = id;
        this.userId = userId;
        this.role = role;
        this.employeeId = employeeId;
        this.active = active;
    }

    public Long getId() {
        return id;
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

    public Boolean getActive() {
        return active;
    }
}