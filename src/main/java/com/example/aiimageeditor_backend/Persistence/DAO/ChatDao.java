package com.example.aiimageeditor_backend.Persistence.DAO;

import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatDao extends JpaRepository<Chat, Long> {
    List<Chat> findByUserId(Long userId);
}
