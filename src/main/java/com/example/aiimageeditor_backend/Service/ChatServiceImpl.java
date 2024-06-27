package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Config.JwtTokenUtil;
import com.example.aiimageeditor_backend.Persistence.DAO.ChatDao;
import com.example.aiimageeditor_backend.Persistence.DAO.UserDao;
import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import com.example.aiimageeditor_backend.Persistence.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    private final ChatDao chatDao;
    private final UserDao userDao;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    public ChatServiceImpl(ChatDao chatDao, UserDao userDao) {
        this.chatDao = chatDao;
        this.userDao = userDao;
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


    @Override
    public List<ChatDto> getChatHistory(String jwt) {
        String token = jwtTokenUtil.extractJwtToken(jwt);
        String email = jwtTokenUtil.extractUsername(token);
        User user = userDao.findByEmail(email);
        List<Chat> chats = chatDao.findByUserId(user.getId());

        return chats.stream()
                .map(chat -> new ChatDto(chat.getId(), chat.getTitle(), chat.getImage().getImageData()))
                .collect(Collectors.toList());
    }
}
