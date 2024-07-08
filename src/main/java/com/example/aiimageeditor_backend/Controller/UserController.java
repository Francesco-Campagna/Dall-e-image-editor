package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.DTO.ChatDto;
import com.example.aiimageeditor_backend.Persistence.DTO.LoginRequestDto;
import com.example.aiimageeditor_backend.Persistence.DTO.RegistrationRequestDto;
import com.example.aiimageeditor_backend.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService u;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequestDto registrationRequest) {
        return u.registerUser(registrationRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        return u.loginUser(loginRequest);
    }

    @PostMapping("/saveApiKey")
    public ResponseEntity<?> saveApiKey(@RequestHeader("Authorization") String jwt, @RequestBody String apiKey) {
        if (jwt == null || jwt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is missing");
        }
        return u.saveApiKey(jwt, apiKey);
    }

    @GetMapping("/getApiKey")
    public ResponseEntity<?> getApiKey(HttpServletRequest request) {
        try {
            String jwt = request.getHeader("Authorization");
            String apiKey = u.getApiKey(jwt);
            return ResponseEntity.ok(Map.of("apiKey", apiKey));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Failed to retrieve API key"));
        }
    }
}
