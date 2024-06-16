package com.example.aiimageeditor_backend.Persistence.DAO;

import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageDao extends JpaRepository<Image, Long> {
    List<Image> findByChatId(Long chatId);

}
