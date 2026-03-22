package com.smartcampus.service;

import com.smartcampus.dto.TicketDTO;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Notification;
import com.smartcampus.model.Ticket;
import com.smartcampus.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service for Module C – Maintenance & Incident Ticketing.
 * Workflow: OPEN → IN_PROGRESS → RESOLVED → CLOSED (or REJECTED)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    private static final String UPLOAD_DIR = "uploads/tickets/";

    /** Get all tickets (Admin/Technician view) */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /** Get tickets reported by the current user */
    public List<Ticket> getMyTickets(String userId) {
        return ticketRepository.findByReportedByUserId(userId);
    }

    /** Get tickets assigned to a technician */
    public List<Ticket> getAssignedTickets(String technicianId) {
        return ticketRepository.findByAssignedToUserId(technicianId);
    }

    /** Get single ticket by ID */
    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    /** Create a new incident ticket */
    public Ticket createTicket(TicketDTO dto, String userId, String userName,
                               List<MultipartFile> attachments) throws IOException {
        List<String> attachmentPaths = new ArrayList<>();

        // Save up to 3 image attachments
        if (attachments != null && !attachments.isEmpty()) {
            if (attachments.size() > 3) {
                throw new IllegalArgumentException("Maximum 3 attachments allowed.");
            }
            for (MultipartFile file : attachments) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);
                Files.copy(file.getInputStream(), uploadPath.resolve(filename));
                attachmentPaths.add(UPLOAD_DIR + filename);
            }
        }

        Ticket ticket = Ticket.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .priority(dto.getPriority() != null ? dto.getPriority() : Ticket.Priority.MEDIUM)
                .resourceId(dto.getResourceId())
                .location(dto.getLocation())
                .reportedByUserId(userId)
                .reportedByUserName(userName)
                .preferredContactEmail(dto.getPreferredContactEmail())
                .preferredContactPhone(dto.getPreferredContactPhone())
                .status(Ticket.TicketStatus.OPEN)
                .attachments(attachmentPaths)
                .comments(new ArrayList<>())
                .build();

        log.info("Creating ticket by user {} : {}", userId, dto.getTitle());
        return ticketRepository.save(ticket);
    }

    /** Update ticket status (Admin/Technician) */
    public Ticket updateTicketStatus(String ticketId, Ticket.TicketStatus newStatus,
                                     String resolutionNotes, String rejectionReason) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setStatus(newStatus);
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);
        if (rejectionReason != null) ticket.setRejectionReason(rejectionReason);
        if (newStatus == Ticket.TicketStatus.RESOLVED) ticket.setResolvedAt(LocalDateTime.now());
        if (newStatus == Ticket.TicketStatus.CLOSED) ticket.setClosedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendTicketStatusNotification(saved);
        return saved;
    }

    /** Assign ticket to a technician (Admin/Manager) */
    public Ticket assignTicket(String ticketId, String technicianId, String technicianName) {
        Ticket ticket = getTicketById(ticketId);
        ticket.setAssignedToUserId(technicianId);
        ticket.setAssignedToUserName(technicianName);
        if (ticket.getStatus() == Ticket.TicketStatus.OPEN) {
            ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        }
        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendTicketStatusNotification(saved);
        return saved;
    }

    /** Add a comment to a ticket */
    public Ticket addComment(String ticketId, String authorId, String authorName, String text) {
        Ticket ticket = getTicketById(ticketId);
        Comment comment = Comment.builder()
                .id(UUID.randomUUID().toString())
                .authorId(authorId)
                .authorName(authorName)
                .text(text)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        if (ticket.getComments() == null) ticket.setComments(new ArrayList<>());
        ticket.getComments().add(comment);

        Ticket saved = ticketRepository.save(ticket);
        notificationService.sendTicketCommentNotification(saved, authorName);
        return saved;
    }

    /** Delete a comment (only by comment author or Admin) */
    public Ticket deleteComment(String ticketId, String commentId, String requestingUserId) {
        Ticket ticket = getTicketById(ticketId);
        List<Comment> comments = ticket.getComments();
        Comment toDelete = comments.stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        // Ownership check (admin bypass should be in controller/security layer)
        if (!toDelete.getAuthorId().equals(requestingUserId)) {
            throw new SecurityException("You can only delete your own comments.");
        }
        comments.remove(toDelete);
        return ticketRepository.save(ticket);
    }

    /** Filter tickets by status and priority */
    public List<Ticket> filterTickets(Ticket.TicketStatus status, Ticket.Priority priority) {
        if (status != null && priority != null) {
            return ticketRepository.findByStatusAndPriority(status, priority);
        }
        if (status != null) return ticketRepository.findByStatus(status);
        if (priority != null) return ticketRepository.findByPriority(priority);
        return ticketRepository.findAll();
    }
}
