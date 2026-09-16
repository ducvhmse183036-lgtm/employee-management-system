package com.employee.backend.controller;

import com.employee.backend.dto.OrganizationUnitTreeNode;
import com.employee.backend.entity.OrganizationUnit;
import com.employee.backend.service.OrganizationUnitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/organization-units")
public class OrganizationUnitController {

    private final OrganizationUnitService organizationUnitService;

    public OrganizationUnitController(
            OrganizationUnitService organizationUnitService
    ) {
        this.organizationUnitService = organizationUnitService;
    }

    @GetMapping("/department/{departmentId}")
    public List<OrganizationUnit> getUnitsByDepartment(
            @PathVariable Long departmentId
    ) {
        return organizationUnitService
                .getActiveUnitsByDepartment(departmentId);
    }
    @GetMapping("/department/{departmentId}/tree")
    public List<OrganizationUnitTreeNode> getUnitTreeByDepartment(
            @PathVariable Long departmentId
    ) {
        return organizationUnitService.getUnitTreeByDepartment(departmentId);
    }
}