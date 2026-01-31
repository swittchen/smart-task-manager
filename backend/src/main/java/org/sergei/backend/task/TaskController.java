package org.sergei.backend.task;

import jakarta.validation.Valid;
import org.sergei.backend.task.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public List<TaskResponse> list(Authentication auth) {
        return service.listMyTasks(auth);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public TaskResponse create(Authentication auth, @Valid @RequestBody TaskCreateRequest req) {
        return service.create(auth, req);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public TaskResponse update(Authentication auth, @PathVariable Long id, @Valid @RequestBody TaskUpdateRequest req) {
        return service.update(auth, id, req);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> delete(Authentication auth, @PathVariable Long id) {
        service.delete(auth, id);
        return ResponseEntity.noContent().build();
    }
}
