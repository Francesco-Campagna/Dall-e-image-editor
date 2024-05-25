package com.example.aiimageeditor_backend.Persistence.Model.Repository;

import com.example.aiimageeditor_backend.Persistence.Model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, Long> {
    Optional<Image> findByLink(String link);
}
