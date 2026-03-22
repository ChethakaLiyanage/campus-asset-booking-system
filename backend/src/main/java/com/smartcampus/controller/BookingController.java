package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.BookingDTO;
import com.smartcampus.model.Booking;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Module B – Booking Management.
 * Base URL: /api/bookings
 *
 * Member 2 Endpoints:
 *  GET    /api/bookings            - Get all bookings (ADMIN)
 *  GET    /api/bookings/my         - Get current user's bookings
 *  GET    /api/bookings/{id}       - Get booking by ID
 *  POST   /api/bookings            - Create a booking request
 *  PATCH  /api/bookings/{id}/approve - Approve booking (ADMIN)
 *  PATCH  /api/bookings/{id}/reject  - Reject booking (ADMIN)
 *  PATCH  /api/bookings/{id}/cancel  - Cancel booking (USER/ADMIN)
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * GET /api/bookings (ADMIN only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings(
            @RequestParam(required = false) Booking.BookingStatus status) {
        List<Booking> bookings = status != null
                ? bookingService.getBookingsByStatus(status)
                : bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings, "Bookings fetched successfully"));
    }

    /**
     * GET /api/bookings/my - Current user's bookings
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        List<Booking> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    /**
     * GET /api/bookings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id)));
    }

    /**
     * POST /api/bookings - Create booking (authenticated users)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(
            @Valid @RequestBody BookingDTO dto,
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        String userName = principal.getAttribute("name");
        Booking booking = bookingService.createBooking(dto, userId, userName);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(booking, "Booking request submitted successfully"));
    }

    /**
     * PATCH /api/bookings/{id}/approve (ADMIN only)
     */
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Booking>> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal OAuth2User principal) {
        String adminId = principal.getAttribute("sub");
        String note = body != null ? body.getOrDefault("note", "") : "";
        Booking booking = bookingService.approveBooking(id, adminId, note);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking approved successfully"));
    }

    /**
     * PATCH /api/bookings/{id}/reject (ADMIN only)
     */
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Booking>> rejectBooking(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal OAuth2User principal) {
        String adminId = principal.getAttribute("sub");
        String reason = body.getOrDefault("reason", "No reason provided");
        Booking booking = bookingService.rejectBooking(id, adminId, reason);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking rejected"));
    }

    /**
     * PATCH /api/bookings/{id}/cancel (USER/ADMIN)
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        Booking booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking cancelled"));
    }
}
