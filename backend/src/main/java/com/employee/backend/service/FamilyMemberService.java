package com.employee.backend.service;

import com.employee.backend.dto.FamilyMemberRequest;
import com.employee.backend.dto.FamilyMemberResponse;
import com.employee.backend.entity.FamilyMember;
import com.employee.backend.repository.EmployeeRepository;
import com.employee.backend.repository.FamilyMemberRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FamilyMemberService {

    private final FamilyMemberRepository familyMemberRepository;
    private final EmployeeRepository employeeRepository;

    public FamilyMemberService(
            FamilyMemberRepository familyMemberRepository,
            EmployeeRepository employeeRepository) {

        this.familyMemberRepository = familyMemberRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<FamilyMemberResponse> getByEmployeeId(Long employeeId) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        return familyMemberRepository
                .findByEmployeeIdOrderByIdAsc(employeeId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public FamilyMemberResponse create(
            Long employeeId,
            FamilyMemberRequest request) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        FamilyMember familyMember = new FamilyMember();

        familyMember.setEmployeeId(employeeId);

        updateFields(familyMember, request);

        if (familyMember.getDependent() == null) {
            familyMember.setDependent(false);
        }

        FamilyMember saved =
                familyMemberRepository.save(familyMember);

        return toResponse(saved);
    }

    public FamilyMemberResponse update(
            Long employeeId,
            Long familyMemberId,
            FamilyMemberRequest request) {

        FamilyMember familyMember =
                familyMemberRepository.findById(familyMemberId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Family member not found"
                                )
                        );

        if (!familyMember.getEmployeeId().equals(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Family member not found for this employee"
            );
        }

        updateFields(familyMember, request);

        if (familyMember.getDependent() == null) {
            familyMember.setDependent(false);
        }

        familyMember.setUpdatedAt(LocalDateTime.now());

        FamilyMember saved =
                familyMemberRepository.save(familyMember);

        return toResponse(saved);
    }

    private void updateFields(
            FamilyMember familyMember,
            FamilyMemberRequest request) {

        familyMember.setFullName(request.getFullName());
        familyMember.setRelationship(request.getRelationship());
        familyMember.setDateOfBirth(request.getDateOfBirth());
        familyMember.setGender(request.getGender());
        familyMember.setPhoneNumber(request.getPhoneNumber());
        familyMember.setOccupation(request.getOccupation());
        familyMember.setDependent(request.getDependent());
        familyMember.setNotes(request.getNotes());
    }

    private FamilyMemberResponse toResponse(
            FamilyMember familyMember) {

        return new FamilyMemberResponse(
                familyMember.getId(),
                familyMember.getEmployeeId(),
                familyMember.getFullName(),
                familyMember.getRelationship(),
                familyMember.getDateOfBirth(),
                familyMember.getGender(),
                familyMember.getPhoneNumber(),
                familyMember.getOccupation(),
                familyMember.getDependent(),
                familyMember.getNotes(),
                familyMember.getCreatedAt(),
                familyMember.getUpdatedAt()
        );
    }
}