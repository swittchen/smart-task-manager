package org.sergei.backend.task;

import jakarta.transaction.Transactional;
import org.sergei.backend.task.dto.TaskCreateRequest;
import org.sergei.backend.task.dto.TaskResponse;
import org.sergei.backend.task.dto.TaskUpdateRequest;
import org.sergei.backend.user.User;
import org.sergei.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository tasks;
    private final UserRepository users;

    public TaskService(TaskRepository tasks, UserRepository users) {
        this.tasks = tasks;
        this.users = users;
    }

    public List<TaskResponse> listMyTasks(Authentication auth) {
        Long userId = currentUserId(auth);
        return tasks.findAllByUserIdOrderByIdDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TaskResponse create(Authentication auth, TaskCreateRequest req) {
        User user = currentUser(auth);

        Task t = new Task();
        t.setTitle(req.title().trim());
        t.setDescription(req.description());
        t.setStatus("OPEN");
        t.setUser(user);

        // category пока null — позже подключим AI и будем заполнять
        Task saved = tasks.save(t);
        return toResponse(saved);
    }

    public TaskResponse update(Authentication auth, Long id, TaskUpdateRequest req) {
        Long userId = currentUserId(auth);

        Task t = tasks.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (req.title() != null) t.setTitle(req.title().trim());
        if (req.description() != null) t.setDescription(req.description());
        if (req.status() != null) t.setStatus(req.status().trim().toUpperCase());

        return toResponse(tasks.save(t));
    }

    @Transactional
    public void delete(Authentication auth, Long id) {
        Long userId = currentUserId(auth);

        Task t = tasks.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        tasks.delete(t);
    }

    //========================HELPER METHODS============================================================
    private Long currentUserId(Authentication auth) {
        return currentUser(auth).getId();
    }

    private User currentUser(Authentication auth) {
        String email = auth.getName();
        return users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.getCategory());
    }
}
