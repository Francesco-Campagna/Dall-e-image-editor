package com.example.aiimageeditor_backend.Persistence.Model.DAO;

import com.example.aiimageeditor_backend.Persistence.Model.Image;

import java.util.List;
import java.util.Optional;


public interface ImageDAO {
    Optional<Image> findById(Long id);
    List<Image> findAll();
    Image save(Image image);
    void deleteById(Long id);
    Optional<Image> findByLink(String link);
}
