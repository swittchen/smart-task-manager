package org.sergei.backend.task.dto;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        String category
) {
}
