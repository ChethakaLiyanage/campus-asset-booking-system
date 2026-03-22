package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Module C – Maintenance & Incident Ticketing
 * Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED
 *           Admin may also set REJECTED with reason.
 *
 * Supports up to 3 image attachments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private TicketCategory category;

    @NotNull(message = "Priority is required")
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    /** Resource or location the incident is about */
    private String resourceId;
    private String location;

    /** User who reported the incident */
    private String reportedByUserId;
    private String reportedByUserName;

    private String preferredContactEmail;
    private String preferredContactPhone;

    /** Technician/staff assigned to this ticket */
    private String assignedToUserId;
    private String assignedToUserName;

    @Builder.Default
    private TicketStatus status = TicketStatus.OPEN;

    /** Resolution notes added by technician */
    private String resolutionNotes;

    /** Rejection reason (Admin only) */
    private String rejectionReason;

    /** Up to 3 image attachment paths/URLs */
    @Size(max = 3, message = "Maximum 3 image attachments allowed")
    private List<String> attachments;

    private List<Comment> comments;

    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        RESOLVED,
        CLOSED,
        REJECTED
    }

    public enum TicketCategory {
        ELECTRICAL,
        PLUMBING,
        EQUIPMENT_FAULT,
        NETWORK,
        CLEANING,
        SECURITY,
        OTHER
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
}
