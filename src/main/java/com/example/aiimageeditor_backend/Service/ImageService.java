package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.Model.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.aiimageeditor_backend.Persistence.Model.DAO.ImageDAO;

import java.util.List;
import java.util.Optional;


@Service
public class ImageService {

    private final ImageDAO imageDAO;

    @Autowired
    public ImageService(ImageDAO imageDAO) {
        this.imageDAO = imageDAO;
    }

    public Optional<Image> getImageById(Long id) {
        return imageDAO.findById(id);
    }

    public List<Image> getAllImages() {
        return imageDAO.findAll();
    }

    public Image saveImage(Image image) {
        return imageDAO.save(image);
    }

    public void deleteImage(Long id) {
        imageDAO.deleteById(id);
    }

    public Optional<Image> getImageByLink(String link) {
        return imageDAO.findByLink(link);
    }
}
