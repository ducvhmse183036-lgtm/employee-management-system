package com.employee.backend.repository;

import com.employee.backend.entity.OrganizationUnit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganizationUnitRepository
        extends JpaRepository<OrganizationUnit, Long> {

    List<OrganizationUnit> findByDepartmentIdAndActiveOrderBySortOrderAsc(
            Long departmentId,
            Boolean active
    );
}