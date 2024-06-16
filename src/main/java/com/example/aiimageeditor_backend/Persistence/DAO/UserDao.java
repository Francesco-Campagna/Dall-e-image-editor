package com.example.aiimageeditor_backend.Persistence.DAO;

import com.example.aiimageeditor_backend.Persistence.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
