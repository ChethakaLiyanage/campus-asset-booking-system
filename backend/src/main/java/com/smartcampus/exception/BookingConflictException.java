package com.smartcampus.exception;

/**
 * Thrown when a booking conflicts with an existing approved booking.
 * Maps to HTTP 409 Conflict.
 */
public class BookingConflictException extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}
