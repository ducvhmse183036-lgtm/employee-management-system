package com.employee.backend.repository;

import com.employee.backend.entity.FamilyMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FamilyMemberRepository
        extends JpaRepository<FamilyMember, Long> {

    List<FamilyMember> findByEmployeeIdOrderByIdAsc(Long employeeId);
}