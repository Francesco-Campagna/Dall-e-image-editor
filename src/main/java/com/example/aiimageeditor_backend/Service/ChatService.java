package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;

import java.util.List;
import java.util.Optional;

public interface ChatService {
    List<Chat> findAll();
    Optional<Chat> findById(Long id);
    List<Chat> findByUserId(Long userId);
    Chat save(Chat chat);
    void deleteById(Long id);
    List<ChatDto> getChatHistoryByUserId(Long userId);
}
