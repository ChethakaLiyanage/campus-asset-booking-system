package com.smartcampus.service;

import com.smartcampus.dto.BookingDTO;
import com.smartcampus.exception.BookingConflictException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Booking;
import com.smartcampus.model.Notification;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service for Module B – Booking Management.
 * Workflow: PENDING → APPROVED / REJECTED → CANCELLED
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    /** Get all bookings (Admin only) */
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /** Get bookings by current user */
    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    /** Get a single booking by ID */
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    /** Create a new booking request */
    public Booking createBooking(BookingDTO dto, String userId, String userName) {
        // Check resource exists
        resourceRepository.findById(dto.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + dto.getResourceId()));

        // Check for scheduling conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                dto.getResourceId(),
                dto.getBookingDate(),
                dto.getStartTime(),
                dto.getEndTime()
        );
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "The resource is already booked for the requested time range.");
        }

        Booking booking = Booking.builder()
                .resourceId(dto.getResourceId())
                .userId(userId)
                .userName(userName)
                .bookingDate(dto.getBookingDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .purpose(dto.getPurpose())
                .expectedAttendees(dto.getExpectedAttendees())
                .status(Booking.BookingStatus.PENDING)
                .build();

        log.info("Creating booking for user {} on resource {}", userId, dto.getResourceId());
        return bookingRepository.save(booking);
    }

    /** Admin: Approve a booking */
    public Booking approveBooking(String bookingId, String adminId, String note) {
        Booking booking = getBookingById(bookingId);
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved.");
        }
        booking.setStatus(Booking.BookingStatus.APPROVED);
        booking.setAdminNote(note);
        booking.setReviewedByAdminId(adminId);
        booking.setReviewedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.sendBookingNotification(saved, Notification.NotificationType.BOOKING_APPROVED);
        return saved;
    }

    /** Admin: Reject a booking */
    public Booking rejectBooking(String bookingId, String adminId, String reason) {
        Booking booking = getBookingById(bookingId);
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be rejected.");
        }
        booking.setStatus(Booking.BookingStatus.REJECTED);
        booking.setAdminNote(reason);
        booking.setReviewedByAdminId(adminId);
        booking.setReviewedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.sendBookingNotification(saved, Notification.NotificationType.BOOKING_REJECTED);
        return saved;
    }

    /** Cancel an approved booking (by user or admin) */
    public Booking cancelBooking(String bookingId, String requestingUserId) {
        Booking booking = getBookingById(bookingId);
        if (booking.getStatus() != Booking.BookingStatus.APPROVED &&
                booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or APPROVED bookings can be cancelled.");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        notificationService.sendBookingNotification(saved, Notification.NotificationType.BOOKING_CANCELLED);
        return saved;
    }

    /** Get bookings by status (Admin filter) */
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}
