package com.smartcampus.dto;

import com.smartcampus.model.Resource;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

/**
 * DTO for creating/updating a Resource (Module A).
 */
@Data
public class ResourceDTO {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private Resource.ResourceType type;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    private LocalTime availableFrom;
    private LocalTime availableTo;

    private Resource.ResourceStatus status;

    private List<String> features;
}
