package com.smartcampus.exception;

/**
 * Thrown when a requested entity (Resource, Booking, Ticket, etc.) is not found.
 * Maps to HTTP 404 Not Found.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
