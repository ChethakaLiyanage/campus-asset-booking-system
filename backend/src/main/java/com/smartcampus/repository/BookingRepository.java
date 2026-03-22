package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repository for Booking entity.
 * Module B – Booking Management
 */
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByUserIdAndStatus(String userId, Booking.BookingStatus status);

    /**
     * Find conflicting bookings for a resource on a given date.
     * Used for scheduling conflict detection.
     * A conflict exists if the new time range overlaps with an existing APPROVED booking.
     */
    @Query("{ 'resourceId': ?0, 'bookingDate': ?1, 'status': 'APPROVED', " +
            "'$or': [ { 'startTime': { '$lt': ?3 }, 'endTime': { '$gt': ?2 } } ] }")
    List<Booking> findConflictingBookings(
            String resourceId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime
    );

    List<Booking> findByResourceIdAndBookingDate(String resourceId, LocalDate bookingDate);
}
