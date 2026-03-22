package com.smartcampus.controller;

import com.smartcampus.dto.ApiResponse;
import com.smartcampus.dto.TicketDTO;
import com.smartcampus.model.Ticket;
import com.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Module C – Maintenance & Incident Ticketing.
 * Base URL: /api/tickets
 *
 * Member 3 Endpoints:
 *  GET    /api/tickets             - Get all tickets (ADMIN/TECHNICIAN)
 *  GET    /api/tickets/my          - Get current user's tickets
 *  GET    /api/tickets/{id}        - Get ticket by ID
 *  POST   /api/tickets             - Create incident ticket (multipart)
 *  PATCH  /api/tickets/{id}/status - Update ticket status (ADMIN/TECHNICIAN)
 *  PATCH  /api/tickets/{id}/assign - Assign ticket to technician (ADMIN)
 *  POST   /api/tickets/{id}/comments    - Add comment
 *  DELETE /api/tickets/{id}/comments/{cId} - Delete comment (owner)
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    /**
     * GET /api/tickets (ADMIN/TECHNICIAN only)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets(
            @RequestParam(required = false) Ticket.TicketStatus status,
            @RequestParam(required = false) Ticket.Priority priority) {
        List<Ticket> tickets = ticketService.filterTickets(status, priority);
        return ResponseEntity.ok(ApiResponse.success(tickets, "Tickets fetched successfully"));
    }

    /**
     * GET /api/tickets/my
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Ticket>>> getMyTickets(
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        return ResponseEntity.ok(ApiResponse.success(ticketService.getMyTickets(userId)));
    }

    /**
     * GET /api/tickets/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketById(id)));
    }

    /**
     * POST /api/tickets - Multipart (with up to 3 image attachments)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Ticket>> createTicket(
            @RequestPart("ticket") @Valid TicketDTO dto,
            @RequestPart(value = "attachments", required = false) List<MultipartFile> attachments,
            @AuthenticationPrincipal OAuth2User principal) throws IOException {
        String userId = principal.getAttribute("sub");
        String userName = principal.getAttribute("name");
        Ticket ticket = ticketService.createTicket(dto, userId, userName, attachments);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(ticket, "Ticket created successfully"));
    }

    /**
     * PATCH /api/tickets/{id}/status (ADMIN/TECHNICIAN)
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Ticket>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        Ticket.TicketStatus newStatus = Ticket.TicketStatus.valueOf(body.get("status"));
        String resolutionNotes = body.get("resolutionNotes");
        String rejectionReason = body.get("rejectionReason");
        Ticket ticket = ticketService.updateTicketStatus(id, newStatus, resolutionNotes, rejectionReason);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Ticket status updated"));
    }

    /**
     * PATCH /api/tickets/{id}/assign (ADMIN/MANAGER only)
     */
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<Ticket>> assignTicket(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String technicianId = body.get("technicianId");
        String technicianName = body.get("technicianName");
        Ticket ticket = ticketService.assignTicket(id, technicianId, technicianName);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Ticket assigned to technician"));
    }

    /**
     * POST /api/tickets/{id}/comments - Add comment
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<Ticket>> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal OAuth2User principal) {
        String authorId = principal.getAttribute("sub");
        String authorName = principal.getAttribute("name");
        String text = body.get("text");
        Ticket ticket = ticketService.addComment(id, authorId, authorName, text);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created(ticket, "Comment added"));
    }

    /**
     * DELETE /api/tickets/{id}/comments/{commentId}
     */
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<ApiResponse<Ticket>> deleteComment(
            @PathVariable String id,
            @PathVariable String commentId,
            @AuthenticationPrincipal OAuth2User principal) {
        String userId = principal.getAttribute("sub");
        Ticket ticket = ticketService.deleteComment(id, commentId, userId);
        return ResponseEntity.ok(ApiResponse.success(ticket, "Comment deleted"));
    }
}
