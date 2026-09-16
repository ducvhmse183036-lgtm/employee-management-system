package com.employee.backend.controller;

import com.employee.backend.entity.Corporation;
import com.employee.backend.service.CorporationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/corporations")
public class CorporationController {

    private final CorporationService corporationService;

    public CorporationController(CorporationService corporationService) {
        this.corporationService = corporationService;
    }

    @GetMapping
    public List<Corporation> getCorporations() {
        return corporationService.getActiveCorporations();
    }
}