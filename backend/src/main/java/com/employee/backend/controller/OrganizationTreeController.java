package com.employee.backend.controller;

import com.employee.backend.dto.CorporationTreeNode;
import com.employee.backend.service.OrganizationTreeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/organization-tree")
public class OrganizationTreeController {

    private final OrganizationTreeService organizationTreeService;

    public OrganizationTreeController(
            OrganizationTreeService organizationTreeService
    ) {
        this.organizationTreeService = organizationTreeService;
    }

    @GetMapping
    public List<CorporationTreeNode> getOrganizationTree() {
        return organizationTreeService.getOrganizationTree();
    }
}