package com.smartcampus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Smart Campus Operations Hub
 * IT3030 - Programming Applications and Frameworks (PAF 2026)
 *
 * Modules:
 *  A - Facilities & Assets Catalogue
 *  B - Booking Management
 *  C - Maintenance & Incident Ticketing
 *  D - Notifications
 *  E - Authentication & Authorization
 */
@SpringBootApplication
public class SmartCampusApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusApplication.class, args);
    }
}
