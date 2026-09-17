package com.employee.backend.service;

import com.employee.backend.entity.Employee;
import com.employee.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmployeePhotoService {

    private final EmployeeRepository employeeRepository;

    private final Path uploadDirectory;

    public EmployeePhotoService(
            EmployeeRepository employeeRepository,
            @Value("${app.upload.employee-photo-dir}") String uploadDir) {

        this.employeeRepository = employeeRepository;

        this.uploadDirectory = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    public String uploadPhoto(
            Long employeeId,
            MultipartFile file) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Employee not found"
                        )
                );

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Photo file is required"
            );
        }

        String contentType = file.getContentType();

        String extension;

        if ("image/jpeg".equals(contentType)) {
            extension = ".jpg";
        } else if ("image/png".equals(contentType)) {
            extension = ".png";
        } else if ("image/webp".equals(contentType)) {
            extension = ".webp";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only JPG, PNG and WEBP images are allowed"
            );
        }

        try {
            Files.createDirectories(uploadDirectory);

            String fileName =
                    UUID.randomUUID() + extension;

            Path targetPath = uploadDirectory
                    .resolve(fileName)
                    .normalize();

            Files.copy(
                    file.getInputStream(),
                    targetPath
            );

            String photoUrl =
                    "/uploads/employee-photos/" + fileName;

            employee.setPhotoUrl(photoUrl);
            employee.setUpdatedAt(LocalDateTime.now());

            employeeRepository.save(employee);

            return photoUrl;

        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save employee photo"
            );
        }
    }
}