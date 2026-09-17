package com.employee.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String employeePhotoDir;

    public WebConfig(
            @Value("${app.upload.employee-photo-dir}")
            String employeePhotoDir) {

        this.employeePhotoDir = employeePhotoDir;
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry) {

        String location = Paths.get(employeePhotoDir)
                .toAbsolutePath()
                .normalize()
                .toUri()
                .toString();

        registry
                .addResourceHandler(
                        "/uploads/employee-photos/**"
                )
                .addResourceLocations(location);
    }
}