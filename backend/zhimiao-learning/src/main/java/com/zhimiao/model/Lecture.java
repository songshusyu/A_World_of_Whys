package com.zhimiao.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "lectures")
public class Lecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "lecture_number", nullable = false)
    private Integer lectureNumber; // 1-5

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    @JsonIgnore
    private Chapter chapter;

    @OneToMany(mappedBy = "lecture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<LectureContent> contents;

    public Lecture() {
    }

    public Lecture(String title, Integer lectureNumber, Integer orderIndex) {
        this.title = title;
        this.lectureNumber = lectureNumber;
        this.orderIndex = orderIndex;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getLectureNumber() {
        return lectureNumber;
    }

    public void setLectureNumber(Integer lectureNumber) {
        this.lectureNumber = lectureNumber;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public List<LectureContent> getContents() {
        return contents;
    }

    public void setContents(List<LectureContent> contents) {
        this.contents = contents;
    }
}
