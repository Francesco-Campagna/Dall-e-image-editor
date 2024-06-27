package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import com.example.aiimageeditor_backend.Service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService c;


    @GetMapping("/history")
    public ResponseEntity<List<ChatDto>> getChatHistory(HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");
            List<ChatDto> chatHistory = c.getChatHistory(jwt);
            return ResponseEntity.ok(chatHistory);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
