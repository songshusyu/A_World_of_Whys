package com.zhimiao.repository;

import com.zhimiao.model.LectureContent;
import com.zhimiao.model.Lecture;
import com.zhimiao.model.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureContentRepository extends JpaRepository<LectureContent, Long> {

    /**
     * 根据讲次查找所有内容
     */
    List<LectureContent> findByLecture(Lecture lecture);

    /**
     * 根据讲次ID查找所有内容
     */
    List<LectureContent> findByLectureId(Long lectureId);

    /**
     * 根据讲次和内容类型查找特定内容
     */
    Optional<LectureContent> findByLectureAndType(Lecture lecture, ContentType type);

    /**
     * 根据讲次ID和内容类型查找特定内容
     */
    Optional<LectureContent> findByLectureIdAndType(Long lectureId, ContentType type);
}
