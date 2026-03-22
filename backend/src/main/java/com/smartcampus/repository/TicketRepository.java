package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Ticket entity.
 * Module C – Maintenance & Incident Ticketing
 */
@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReportedByUserId(String userId);

    List<Ticket> findByAssignedToUserId(String technicianId);

    List<Ticket> findByStatus(Ticket.TicketStatus status);

    List<Ticket> findByCategory(Ticket.TicketCategory category);

    List<Ticket> findByPriority(Ticket.Priority priority);

    List<Ticket> findByStatusAndPriority(Ticket.TicketStatus status, Ticket.Priority priority);

    List<Ticket> findByResourceId(String resourceId);
}
