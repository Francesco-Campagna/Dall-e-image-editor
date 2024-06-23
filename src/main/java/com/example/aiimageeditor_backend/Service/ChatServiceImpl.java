package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.DAO.ChatDao;
import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatDao chatDao;

    @Autowired
    public ChatServiceImpl(ChatDao chatDao) {
        this.chatDao = chatDao;
    }

    @Override
    public List<Chat> findAll() {
        return chatDao.findAll();
    }

    @Override
    public Optional<Chat> findById(Long id) {
        return chatDao.findById(id);
    }

    @Override
    public List<Chat> findByUserId(Long userId) {
        return chatDao.findByUserId(userId);
    }

    @Override
    public Chat save(Chat chat) {
        return chatDao.save(chat);
    }


    public List<ChatDto> getChatHistoryByUserId(Long userId) {
        List<Chat> chats = chatDao.findByUserId(userId);

        return chats.stream()
                .map(chat -> new ChatDto(chat.getId(), chat.getTitle(), chat.getImage().getImageData()))
                .collect(Collectors.toList());
    }
}
