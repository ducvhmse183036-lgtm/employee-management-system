package com.employee.backend.dto;

import java.util.List;

public class CorporationTreeNode {

    private Long id;
    private String code;
    private String name;

    private List<DepartmentTreeNode> departments;

    public CorporationTreeNode(
            Long id,
            String code,
            String name,
            List<DepartmentTreeNode> departments
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.departments = departments;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public List<DepartmentTreeNode> getDepartments() {
        return departments;
    }
}