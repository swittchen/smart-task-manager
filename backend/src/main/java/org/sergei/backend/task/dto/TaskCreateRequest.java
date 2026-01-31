package org.sergei.backend.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskCreateRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 10_000) String description
) {
}
