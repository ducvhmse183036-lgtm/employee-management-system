package com.employee.backend.controller;

import com.employee.backend.dto.FamilyMemberRequest;
import com.employee.backend.dto.FamilyMemberResponse;
import com.employee.backend.service.FamilyMemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees/{employeeId}/family-members")
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    public FamilyMemberController(
            FamilyMemberService familyMemberService) {

        this.familyMemberService = familyMemberService;
    }

    @GetMapping
    public List<FamilyMemberResponse> getFamilyMembers(
            @PathVariable Long employeeId) {

        return familyMemberService.getByEmployeeId(employeeId);
    }

    @PostMapping
    public ResponseEntity<FamilyMemberResponse> createFamilyMember(
            @PathVariable Long employeeId,
            @Valid @RequestBody FamilyMemberRequest request) {

        FamilyMemberResponse created =
                familyMemberService.create(employeeId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
    }

    @PutMapping("/{familyMemberId}")
    public FamilyMemberResponse updateFamilyMember(
            @PathVariable Long employeeId,
            @PathVariable Long familyMemberId,
            @Valid @RequestBody FamilyMemberRequest request) {

        return familyMemberService.update(
                employeeId,
                familyMemberId,
                request
        );
    }
}