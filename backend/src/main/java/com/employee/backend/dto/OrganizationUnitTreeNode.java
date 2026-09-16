package com.employee.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class OrganizationUnitTreeNode {

    private Long id;
    private Long departmentId;
    private Long parentId;

    private String code;
    private String name;
    private String unitType;

    private Integer sortOrder;

    private List<OrganizationUnitTreeNode> children = new ArrayList<>();

    public OrganizationUnitTreeNode(
            Long id,
            Long departmentId,
            Long parentId,
            String code,
            String name,
            String unitType,
            Integer sortOrder
    ) {
        this.id = id;
        this.departmentId = departmentId;
        this.parentId = parentId;
        this.code = code;
        this.name = name;
        this.unitType = unitType;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public Long getParentId() {
        return parentId;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getUnitType() {
        return unitType;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public List<OrganizationUnitTreeNode> getChildren() {
        return children;
    }

    public void addChild(OrganizationUnitTreeNode child) {
        children.add(child);
    }
}