package com.zhimiao.service;

import com.zhimiao.model.Note;
import com.zhimiao.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Transactional(readOnly = true)
    public List<Note> getNotesByUserId(Long userId) {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Note> searchNotes(Long userId, String query) {
        return noteRepository.findByUserIdAndTitleContainingOrderByUpdatedAtDesc(userId, query);
    }

    @Transactional(readOnly = true)
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    @Transactional
    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    @Transactional
    public Note updateNote(Note note) {
        return noteRepository.save(note);
    }

    @Transactional
    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}