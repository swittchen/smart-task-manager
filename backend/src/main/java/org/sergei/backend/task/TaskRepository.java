package org.sergei.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByUserIdOrderByIdDesc(Long userId);
    Optional<Task> findByIdAndUserId(Long id, Long userId);
    @Query("""
    select t from Task t
    where t.user.id = :userId
      and (
        lower(t.title) like lower(concat('%', :q, '%'))
        or lower(t.description) like lower(concat('%', :q, '%'))
      )
    order by t.id desc
""")
    List<Task> searchOwned(@Param("userId") Long userId, @Param("q") String q);

}
