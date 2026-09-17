package com.employee.backend.controller;

import com.employee.backend.service.EmployeePhotoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/employees/{employeeId}/photo")
public class EmployeePhotoController {

    private final EmployeePhotoService employeePhotoService;

    public EmployeePhotoController(
            EmployeePhotoService employeePhotoService) {

        this.employeePhotoService = employeePhotoService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @PathVariable Long employeeId,
            @RequestParam("file") MultipartFile file) {

        String photoUrl =
                employeePhotoService.uploadPhoto(employeeId, file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "photoUrl", photoUrl
                ));
    }
}