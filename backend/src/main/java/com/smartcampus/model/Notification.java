package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Module D – Notifications
 * Triggered by: booking approval/rejection, ticket status changes, new comments.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    /** Recipient user ID */
    private String userId;

    private NotificationType type;

    private String title;
    private String message;

    /** Reference entity ID (bookingId, ticketId, etc.) */
    private String referenceId;

    private ReferenceType referenceType;

    @Builder.Default
    private boolean read = false;

    @CreatedDate
    private LocalDateTime createdAt;

    public enum NotificationType {
        BOOKING_APPROVED,
        BOOKING_REJECTED,
        BOOKING_CANCELLED,
        TICKET_STATUS_CHANGED,
        TICKET_ASSIGNED,
        TICKET_COMMENT_ADDED,
        GENERAL
    }

    public enum ReferenceType {
        BOOKING,
        TICKET
    }
}
