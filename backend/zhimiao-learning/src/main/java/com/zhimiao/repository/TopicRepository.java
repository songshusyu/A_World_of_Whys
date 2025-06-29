package com.zhimiao.repository;

import com.zhimiao.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Long> {

    /**
     * 根据主题名称查找主题
     */
    Optional<Topic> findByName(String name);

    /**
     * 检查主题名称是否存在
     */
    boolean existsByName(String name);

    /**
     * 根据主题名称查找主题，并预加载模块
     */
    @Query("SELECT t FROM Topic t LEFT JOIN FETCH t.modules m WHERE t.name = :name")
    Optional<Topic> findByNameWithModules(@Param("name") String name);
}
