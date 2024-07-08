package com.example.aiimageeditor_backend.Persistence.DAO;

import com.example.aiimageeditor_backend.Persistence.Entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Long> {
    User findByEmail(String email);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.apiKey = :apiKey WHERE u.email = :email")
    void updateApiKey(@Param("email") String email, @Param("apiKey") String apiKey);
}
