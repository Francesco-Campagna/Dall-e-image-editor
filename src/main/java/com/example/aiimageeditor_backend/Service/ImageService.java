package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ImageService {
    Optional<Image> getImageById(Long id);
    List<Image> getAllImages();
    void deleteImage(Long id);
    List<Image> findByChatId(Long chatId);
    Optional<BufferedImage> createMask(BufferedImage image, int top, int left, int width, int height);
    BufferedImage readSelectedImage(MultipartFile selectedImage) throws IOException;
    int convertPixelStringToInt(String value);
    void saveImageAndCreateChat(String base64Image, String chatTitle, Long userId);
}
