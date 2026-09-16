package com.employee.backend.service;

import com.employee.backend.dto.CorporationTreeNode;
import com.employee.backend.dto.DepartmentTreeNode;
import com.employee.backend.dto.OrganizationUnitTreeNode;
import com.employee.backend.entity.Corporation;
import com.employee.backend.entity.Department;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrganizationTreeService {

    private final CorporationService corporationService;
    private final DepartmentService departmentService;
    private final OrganizationUnitService organizationUnitService;

    public OrganizationTreeService(
            CorporationService corporationService,
            DepartmentService departmentService,
            OrganizationUnitService organizationUnitService
    ) {
        this.corporationService = corporationService;
        this.departmentService = departmentService;
        this.organizationUnitService = organizationUnitService;
    }

    public List<CorporationTreeNode> getOrganizationTree() {

        List<Corporation> corporations =
                corporationService.getActiveCorporations();

        List<CorporationTreeNode> corporationTree =
                new ArrayList<>();

        for (Corporation corporation : corporations) {

            List<Department> departments =
                    departmentService.getActiveDepartmentsByCorporation(
                            corporation.getId()
                    );

            List<DepartmentTreeNode> departmentTree =
                    new ArrayList<>();

            for (Department department : departments) {

                List<OrganizationUnitTreeNode> organizationUnits =
                        organizationUnitService.getUnitTreeByDepartment(
                                department.getId()
                        );

                DepartmentTreeNode departmentNode =
                        new DepartmentTreeNode(
                                department.getId(),
                                department.getCorporationId(),
                                department.getCode(),
                                department.getName(),
                                organizationUnits
                        );

                departmentTree.add(departmentNode);
            }

            CorporationTreeNode corporationNode =
                    new CorporationTreeNode(
                            corporation.getId(),
                            corporation.getCode(),
                            corporation.getName(),
                            departmentTree
                    );

            corporationTree.add(corporationNode);
        }

        return corporationTree;
    }
}