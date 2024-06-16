package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService c;


    @GetMapping("/chat/history/{userId}")
    public ResponseEntity<List<ChatDto>> getChatHistory(@PathVariable Long userId) {
        try {
            List<ChatDto> chatHistory = c.getChatHistoryByUserId(userId);
            return ResponseEntity.ok(chatHistory);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
