package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.model.Notification;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Module D – Notifications.
 * Base URL: /api/notifications
 *
 * Member 4 Endpoints:
 *  GET    /api/notifications            - Get all notifications for current user
 *  GET    /api/notifications/unread     - Get unread notifications
 *  GET    /api/notifications/count      - Get unread count (for badge)
 *  PATCH  /api/notifications/{id}/read  - Mark notification as read
 *  PATCH  /api/notifications/read-all   - Mark all as read
 *  DELETE /api/notifications/{id}       - Delete a notification
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * GET /api/notifications - All notifications for current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        List<Notification> notifications = notificationService.getMyNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(notifications));
    }

    /**
     * GET /api/notifications/unread
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Notification>>> getUnreadNotifications(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        return ResponseEntity.ok(ApiResponse.success(
                notificationService.getUnreadNotifications(userId)));
    }

    /**
     * GET /api/notifications/count - Unread badge count
     */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        long count = notificationService.countUnreadNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("unreadCount", count)));
    }

    /**
     * PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        Notification notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(ApiResponse.success(notification, "Marked as read"));
    }

    /**
     * PATCH /api/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }

    /**
     * DELETE /api/notifications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable String id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Notification deleted"));
    }
}
