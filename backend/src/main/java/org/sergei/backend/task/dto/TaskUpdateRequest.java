package org.sergei.backend.task.dto;

import jakarta.validation.constraints.Size;

public record TaskUpdateRequest(
        @Size(max = 200) String title,
        @Size(max = 10_000) String description,
        @Size(max = 30) String status
) {
}
