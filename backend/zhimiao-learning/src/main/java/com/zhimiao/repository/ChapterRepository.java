package com.zhimiao.repository;

import com.zhimiao.model.Chapter;
import com.zhimiao.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {

    /**
     * 根据模块查找所有章节，按顺序排列
     */
    List<Chapter> findByModuleOrderByOrderIndex(Module module);

    /**
     * 根据模块ID查找所有章节
     */
    List<Chapter> findByModuleIdOrderByOrderIndex(Long moduleId);

    /**
     * 根据模块查找章节，并预加载讲次
     */
    @Query("SELECT c FROM Chapter c LEFT JOIN FETCH c.lectures l WHERE c.module.id = :moduleId ORDER BY c.orderIndex")
    List<Chapter> findByModuleIdWithLectures(@Param("moduleId") Long moduleId);
}
