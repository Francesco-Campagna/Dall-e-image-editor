package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.DTO.LoginRequestDto;
import com.example.aiimageeditor_backend.Persistence.DTO.RegistrationRequestDto;
import com.example.aiimageeditor_backend.Persistence.Entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void deleteById(Long id);
    UserDetails loadUserByUsername(String email);
    ResponseEntity<?> registerUser(RegistrationRequestDto registrationRequest);
    ResponseEntity<?> loginUser(LoginRequestDto loginRequest);
    ResponseEntity<?> saveApiKey(String jwt, String apiKey);
    String getApiKey(String token);


}
