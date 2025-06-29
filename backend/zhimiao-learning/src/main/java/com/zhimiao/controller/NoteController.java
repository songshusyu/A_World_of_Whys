package com.zhimiao.controller;

import com.zhimiao.model.Note;
import com.zhimiao.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ResponseEntity<List<Note>> getNotes(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(noteService.getNotesByUserId(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(
            Authentication authentication,
            @RequestParam String query) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(noteService.searchNotes(userId, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(
            Authentication authentication,
            @PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Note> createNote(
            Authentication authentication,
            @RequestBody Note note) {
        note.setUserId(getUserIdFromAuthentication(authentication));
        return ResponseEntity.ok(noteService.createNote(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody Note note) {
        Long userId = getUserIdFromAuthentication(authentication);
        return noteService.getNoteById(id)
                .filter(n -> n.getUserId().equals(userId))
                .map(existingNote -> {
                    note.setId(id);
                    note.setUserId(userId);
                    return ResponseEntity.ok(noteService.updateNote(note));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = getUserIdFromAuthentication(authentication);
        return noteService.getNoteById(id)
                .filter(note -> note.getUserId().equals(userId))
                .map(note -> {
                    noteService.deleteNote(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // 这里需要根据你的用户认证实现来获取用户ID
        // 示例实现，实际应该根据你的用户系统来实现
        return 1L; // 临时返回固定值，需要根据实际情况修改
    }
}