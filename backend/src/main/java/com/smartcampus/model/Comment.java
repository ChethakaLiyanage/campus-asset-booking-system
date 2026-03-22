package com.smartcampus.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Embedded document - Comment on a Ticket.
 * Comment ownership: only the author can edit/delete their own comment.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    private String id;

    private String authorId;
    private String authorName;

    @NotBlank(message = "Comment text is required")
    private String text;

    private boolean edited;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
