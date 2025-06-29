package com.zhimiao.controller;

import com.zhimiao.model.Note;
import com.zhimiao.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ResponseEntity<List<Note>> getNotes() {
        // 使用测试用户ID
        Long userId = 1L;
        return ResponseEntity.ok(noteService.getNotesByUserId(userId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Note>> searchNotes(@RequestParam String query) {
        // 使用测试用户ID
        Long userId = 1L;
        return ResponseEntity.ok(noteService.searchNotes(userId, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        // 使用测试用户ID
        note.setUserId(1L);
        return ResponseEntity.ok(noteService.createNote(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note note) {
        // 使用测试用户ID
        Long userId = 1L;
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
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        // 使用测试用户ID
        Long userId = 1L;
        return noteService.getNoteById(id)
                .filter(note -> note.getUserId().equals(userId))
                .map(note -> {
                    noteService.deleteNote(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}