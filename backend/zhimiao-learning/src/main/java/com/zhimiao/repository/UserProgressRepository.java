package com.zhimiao.repository;

import com.zhimiao.model.UserProgress;
import com.zhimiao.model.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    /**
     * 根据用户ID查找所有进度记录
     */
    List<UserProgress> findByUserId(String userId);

    /**
     * 根据用户ID和讲次查找进度
     */
    Optional<UserProgress> findByUserIdAndLecture(String userId, Lecture lecture);

    /**
     * 根据用户ID和讲次ID查找进度
     */
    Optional<UserProgress> findByUserIdAndLectureId(String userId, Long lectureId);

    /**
     * 根据用户ID查找已完成的讲次数量
     */
    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.userId = :userId AND up.completed = true")
    Long countCompletedByUserId(@Param("userId") String userId);

    /**
     * 根据用户ID查找最近访问的进度记录
     */
    @Query("SELECT up FROM UserProgress up WHERE up.userId = :userId ORDER BY up.lastAccessedAt DESC")
    List<UserProgress> findByUserIdOrderByLastAccessedAtDesc(@Param("userId") String userId);
}
