package com.zhimiao.repository;

import com.zhimiao.model.Lecture;
import com.zhimiao.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {

    /**
     * 根据章节查找所有讲次，按顺序排列
     */
    List<Lecture> findByChapterOrderByOrderIndex(Chapter chapter);

    /**
     * 根据章节ID查找所有讲次
     */
    List<Lecture> findByChapterIdOrderByOrderIndex(Long chapterId);

    /**
     * 根据章节查找讲次，并预加载内容
     */
    @Query("SELECT l FROM Lecture l LEFT JOIN FETCH l.contents c WHERE l.chapter.id = :chapterId ORDER BY l.orderIndex")
    List<Lecture> findByChapterIdWithContents(@Param("chapterId") Long chapterId);
}
