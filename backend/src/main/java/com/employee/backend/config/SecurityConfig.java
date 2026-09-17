package com.employee.backend.config;

import com.employee.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // REST API dùng JWT nên không dùng CSRF token
                .csrf(csrf -> csrf.disable())

                // Không tạo session trên server
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login không cần JWT
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login"
                        ).permitAll()

                        // Health check cho phép public
                        .requestMatchers("/api/health")
                        .permitAll()

                        // Chỉ ADMIN được tạo tài khoản hệ thống
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/users"
                        ).hasRole("ADMIN")

                        // Chỉ ADMIN được xóa employee
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/employees/**"
                        ).hasRole("ADMIN")

                        // ADMIN và HR được tạo employee
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/employees/**"
                        ).hasAnyRole("ADMIN", "HR")

                        // ADMIN và HR được sửa employee
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/employees/**"
                        ).hasAnyRole("ADMIN", "HR")

                        // Cả ADMIN, HR, VIEWER đều được xem employee
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/employees/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "HR",
                                "VIEWER"
                        )

                        // Các API khác bắt buộc phải login
                        .anyRequest()
                        .authenticated()
                )

                // JWT filter chạy trước filter đăng nhập mặc định
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}