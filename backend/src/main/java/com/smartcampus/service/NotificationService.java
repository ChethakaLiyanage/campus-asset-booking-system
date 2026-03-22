package com.smartcampus.service;

import com.smartcampus.model.Booking;
import com.smartcampus.model.Notification;
import com.smartcampus.model.Ticket;
import com.smartcampus.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for Module D – Notifications.
 * Creates and manages in-app notifications for users.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /** Get all notifications for a user (newest first) */
    public List<Notification> getMyNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /** Get unread notifications for a user */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndRead(userId, false);
    }

    /** Count unread notifications (for badge on UI) */
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    /** Mark a single notification as read */
    public Notification markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    /** Mark ALL notifications for a user as read */
    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndRead(userId, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    /** Delete a notification */
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // ====== Internal notification senders ======

    /** Send booking approval/rejection/cancellation notification */
    public void sendBookingNotification(Booking booking, Notification.NotificationType type) {
        String message = switch (type) {
            case BOOKING_APPROVED -> "Your booking has been approved!";
            case BOOKING_REJECTED -> "Your booking has been rejected. Reason: " + booking.getAdminNote();
            case BOOKING_CANCELLED -> "Your booking has been cancelled.";
            default -> "Your booking status has changed.";
        };

        Notification notification = Notification.builder()
                .userId(booking.getUserId())
                .type(type)
                .title("Booking Update")
                .message(message)
                .referenceId(booking.getId())
                .referenceType(Notification.ReferenceType.BOOKING)
                .read(false)
                .build();

        log.info("Sending booking notification to user {}: {}", booking.getUserId(), message);
        notificationRepository.save(notification);
    }

    /** Send ticket status change notification */
    public void sendTicketStatusNotification(Ticket ticket) {
        Notification notification = Notification.builder()
                .userId(ticket.getReportedByUserId())
                .type(Notification.NotificationType.TICKET_STATUS_CHANGED)
                .title("Ticket Status Update")
                .message("Your ticket '" + ticket.getTitle() + "' status changed to: " + ticket.getStatus())
                .referenceId(ticket.getId())
                .referenceType(Notification.ReferenceType.TICKET)
                .read(false)
                .build();

        log.info("Sending ticket status notification to user {}", ticket.getReportedByUserId());
        notificationRepository.save(notification);
    }

    /** Send ticket comment notification */
    public void sendTicketCommentNotification(Ticket ticket, String commenterName) {
        // Notify the ticket owner (if the commenter is not the owner)
        if (!ticket.getReportedByUserId().equals(commenterName)) {
            Notification notification = Notification.builder()
                    .userId(ticket.getReportedByUserId())
                    .type(Notification.NotificationType.TICKET_COMMENT_ADDED)
                    .title("New Comment on Your Ticket")
                    .message(commenterName + " commented on your ticket: " + ticket.getTitle())
                    .referenceId(ticket.getId())
                    .referenceType(Notification.ReferenceType.TICKET)
                    .read(false)
                    .build();
            notificationRepository.save(notification);
        }
    }
}
