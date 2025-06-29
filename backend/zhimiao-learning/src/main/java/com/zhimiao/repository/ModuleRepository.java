package com.zhimiao.repository;

import com.zhimiao.model.Module;
import com.zhimiao.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    /**
     * 根据主题查找所有模块，按顺序排列
     */
    List<Module> findByTopicOrderByOrderIndex(Topic topic);

    /**
     * 根据主题ID查找所有模块
     */
    List<Module> findByTopicIdOrderByOrderIndex(Long topicId);

    /**
     * 根据主题和模块标题查找模块
     */
    Optional<Module> findByTopicAndTitle(Topic topic, String title);

    /**
     * 根据主题查找模块，并预加载章节
     */
    @Query("SELECT m FROM Module m LEFT JOIN FETCH m.chapters c WHERE m.topic.id = :topicId ORDER BY m.orderIndex")
    List<Module> findByTopicIdWithChapters(@Param("topicId") Long topicId);
}
