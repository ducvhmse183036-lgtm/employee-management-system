package com.employee.backend.dto;

import java.util.List;

public class DepartmentTreeNode {

    private Long id;
    private Long corporationId;
    private String code;
    private String name;

    private List<OrganizationUnitTreeNode> organizationUnits;

    public DepartmentTreeNode(
            Long id,
            Long corporationId,
            String code,
            String name,
            List<OrganizationUnitTreeNode> organizationUnits
    ) {
        this.id = id;
        this.corporationId = corporationId;
        this.code = code;
        this.name = name;
        this.organizationUnits = organizationUnits;
    }

    public Long getId() {
        return id;
    }

    public Long getCorporationId() {
        return corporationId;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public List<OrganizationUnitTreeNode> getOrganizationUnits() {
        return organizationUnits;
    }
}