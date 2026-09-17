package com.employee.backend.service;

import com.employee.backend.dto.EmployeePersonalInfoRequest;
import com.employee.backend.dto.EmployeePersonalInfoResponse;
import com.employee.backend.entity.EmployeePersonalInfo;
import com.employee.backend.repository.EmployeePersonalInfoRepository;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class EmployeePersonalInfoService {

    private final EmployeePersonalInfoRepository personalInfoRepository;
    private final EmployeeRepository employeeRepository;

    public EmployeePersonalInfoService(
            EmployeePersonalInfoRepository personalInfoRepository,
            EmployeeRepository employeeRepository) {

        this.personalInfoRepository = personalInfoRepository;
        this.employeeRepository = employeeRepository;
    }

    public EmployeePersonalInfoResponse getByEmployeeId(Long employeeId) {

        EmployeePersonalInfo personalInfo =
                personalInfoRepository.findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Personal info not found"
                                )
                        );

        return toResponse(personalInfo);
    }

    public EmployeePersonalInfoResponse create(
            Long employeeId,
            EmployeePersonalInfoRequest request) {

        if (!employeeRepository.existsById(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Employee not found"
            );
        }

        if (personalInfoRepository.existsByEmployeeId(employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Personal info already exists"
            );
        }

        EmployeePersonalInfo personalInfo =
                new EmployeePersonalInfo();

        personalInfo.setEmployeeId(employeeId);

        updateFields(personalInfo, request);

        EmployeePersonalInfo saved =
                personalInfoRepository.save(personalInfo);

        return toResponse(saved);
    }

    public EmployeePersonalInfoResponse update(
            Long employeeId,
            EmployeePersonalInfoRequest request) {

        EmployeePersonalInfo personalInfo =
                personalInfoRepository.findByEmployeeId(employeeId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Personal info not found"
                                )
                        );

        updateFields(personalInfo, request);

        personalInfo.setUpdatedAt(LocalDateTime.now());

        EmployeePersonalInfo saved =
                personalInfoRepository.save(personalInfo);

        return toResponse(saved);
    }

    private void updateFields(
            EmployeePersonalInfo personalInfo,
            EmployeePersonalInfoRequest request) {

        personalInfo.setDateOfBirth(request.getDateOfBirth());
        personalInfo.setPlaceOfBirth(request.getPlaceOfBirth());
        personalInfo.setNationality(request.getNationality());
        personalInfo.setMaritalStatus(request.getMaritalStatus());
        personalInfo.setPhoneNumber(request.getPhoneNumber());
        personalInfo.setEmail(request.getEmail());
        personalInfo.setPermanentAddress(request.getPermanentAddress());
        personalInfo.setCurrentAddress(request.getCurrentAddress());
    }

    private EmployeePersonalInfoResponse toResponse(
            EmployeePersonalInfo personalInfo) {

        return new EmployeePersonalInfoResponse(
                personalInfo.getId(),
                personalInfo.getEmployeeId(),
                personalInfo.getDateOfBirth(),
                personalInfo.getPlaceOfBirth(),
                personalInfo.getNationality(),
                personalInfo.getMaritalStatus(),
                personalInfo.getPhoneNumber(),
                personalInfo.getEmail(),
                personalInfo.getPermanentAddress(),
                personalInfo.getCurrentAddress(),
                personalInfo.getCreatedAt(),
                personalInfo.getUpdatedAt()
        );
    }
}