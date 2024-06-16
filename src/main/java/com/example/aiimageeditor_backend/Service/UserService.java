package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.Entities.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    User save(User user);
    void deleteById(Long id);
}
