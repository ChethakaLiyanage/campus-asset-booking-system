package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Module E – Authentication & Authorization
 * Represents a system user (supports OAuth2 Google login).
 * Roles: USER, ADMIN, TECHNICIAN
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;

    private String profilePicture;

    /** OAuth2 provider (e.g., "google") */
    private String provider;

    /** Provider-specific user ID from OAuth2 */
    private String providerId;

    private Set<Role> roles;

    private boolean enabled;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum Role {
        USER,
        ADMIN,
        TECHNICIAN,
        MANAGER
    }
}
