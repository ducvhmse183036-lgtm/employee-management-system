package com.employee.backend.repository;

import com.employee.backend.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByEmployeeCode(String employeeCode);

    List<Employee> findByStatus(String status);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    List<Employee> findByStatusAndDepartmentId(
            String status,
            Long departmentId
    );
    List<Employee> findByStatusAndOrganizationUnitId(
            String status,
            Long organizationUnitId
    );
    @Query("""
        SELECT e
        FROM Employee e
        WHERE e.status = 'ACTIVE'
          AND (
                LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(e.surname) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(COALESCE(e.middleName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
             OR LOWER(e.givenName) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
        """)
    List<Employee> searchActiveEmployees(@Param("keyword") String keyword);

}