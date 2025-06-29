package com.zhimiao.repository;

import com.zhimiao.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<Note> findByUserIdAndTitleContainingOrderByUpdatedAtDesc(Long userId, String title);
}