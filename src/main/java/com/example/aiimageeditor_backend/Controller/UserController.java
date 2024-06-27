package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.DTO.LoginRequestDto;
import com.example.aiimageeditor_backend.Persistence.DTO.RegistrationRequestDto;
import com.example.aiimageeditor_backend.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


}
