package com.employee.backend.service;

import com.employee.backend.entity.Corporation;
import com.employee.backend.repository.CorporationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CorporationService {

    private final CorporationRepository corporationRepository;

    public CorporationService(CorporationRepository corporationRepository) {
        this.corporationRepository = corporationRepository;
    }

    public List<Corporation> getActiveCorporations() {
        return corporationRepository.findByActiveOrderByNameAsc(true);
    }
}