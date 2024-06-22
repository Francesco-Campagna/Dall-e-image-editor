package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

public interface ImageService {
    Optional<Image> getImageById(Long id);
    ResponseEntity<byte[]> createMask(MultipartFile image, String top, String left, String width, String height) throws IOException;
    void saveImageAndCreateChat(String imageData) throws IOException;
    ResponseEntity<byte[]> convertGeneratedToFile(Map<String, String> requestBody);



}
