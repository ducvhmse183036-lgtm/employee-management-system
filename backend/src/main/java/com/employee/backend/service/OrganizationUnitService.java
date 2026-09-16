package com.employee.backend.service;

import com.employee.backend.entity.OrganizationUnit;
import com.employee.backend.repository.OrganizationUnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import com.employee.backend.dto.OrganizationUnitTreeNode;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrganizationUnitService {

    private final OrganizationUnitRepository organizationUnitRepository;

    public OrganizationUnitService(
            OrganizationUnitRepository organizationUnitRepository
    ) {
        this.organizationUnitRepository = organizationUnitRepository;
    }

    public List<OrganizationUnit> getActiveUnitsByDepartment(Long departmentId) {
        return organizationUnitRepository
                .findByDepartmentIdAndActiveOrderBySortOrderAsc(
                        departmentId,
                        true
                );
    }
    public List<OrganizationUnitTreeNode> getUnitTreeByDepartment(Long departmentId) {

        List<OrganizationUnit> units =
                organizationUnitRepository
                        .findByDepartmentIdAndActiveOrderBySortOrderAsc(
                                departmentId,
                                true
                        );

        Map<Long, OrganizationUnitTreeNode> nodeMap = new LinkedHashMap<>();

        for (OrganizationUnit unit : units) {

            OrganizationUnitTreeNode node =
                    new OrganizationUnitTreeNode(
                            unit.getId(),
                            unit.getDepartmentId(),
                            unit.getParentId(),
                            unit.getCode(),
                            unit.getName(),
                            unit.getUnitType(),
                            unit.getSortOrder()
                    );

            nodeMap.put(unit.getId(), node);
        }

        List<OrganizationUnitTreeNode> roots = new ArrayList<>();

        for (OrganizationUnit unit : units) {

            OrganizationUnitTreeNode currentNode =
                    nodeMap.get(unit.getId());

            if (unit.getParentId() == null) {

                roots.add(currentNode);

            } else {

                OrganizationUnitTreeNode parentNode =
                        nodeMap.get(unit.getParentId());

                if (parentNode != null) {
                    parentNode.addChild(currentNode);
                }
            }
        }

        return roots;
    }
}