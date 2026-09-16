package com.employee.backend.repository;

import com.employee.backend.entity.Corporation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CorporationRepository
        extends JpaRepository<Corporation, Long> {

    List<Corporation> findByActiveOrderByNameAsc(Boolean active);
}