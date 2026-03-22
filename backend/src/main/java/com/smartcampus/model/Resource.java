package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Module A – Facilities & Assets Catalogue
 * Represents a bookable resource: lecture hall, lab, meeting room, or equipment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private String description;

    private String location;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    /** Availability window start (e.g., 08:00) */
    private LocalTime availableFrom;

    /** Availability window end (e.g., 20:00) */
    private LocalTime availableTo;

    @NotNull(message = "Status is required")
    @Builder.Default
    private ResourceStatus status = ResourceStatus.ACTIVE;

    /** Image URL for this resource (optional) */
    private String imageUrl;

    /** Tags for search/filtering (e.g., "projector", "whiteboard") */
    private List<String> features;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ResourceType {
        LECTURE_HALL,
        LAB,
        MEETING_ROOM,
        EQUIPMENT
    }

    public enum ResourceStatus {
        ACTIVE,
        OUT_OF_SERVICE,
        UNDER_MAINTENANCE
    }
}
