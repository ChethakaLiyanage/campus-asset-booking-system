package com.smartcampus.dto;

import com.smartcampus.model.Ticket;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for creating/updating a Ticket (Module C).
 */
@Data
public class TicketDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private Ticket.TicketCategory category;

    private Ticket.Priority priority;

    private String resourceId;
    private String location;

    private String preferredContactEmail;
    private String preferredContactPhone;
}
