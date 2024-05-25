package com.example.aiimageeditor_backend.Persistence.Model.DAO;

import com.example.aiimageeditor_backend.Persistence.Model.Image;
import com.example.aiimageeditor_backend.Persistence.Model.Repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ImageDAOImpl implements ImageDAO {

    private final ImageRepository imageRepository;

    @Autowired
    public ImageDAOImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public Optional<Image> findById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    public List<Image> findAll() {
        return imageRepository.findAll();
    }

    @Override
    public Image save(Image image) {
        String base64WithPrefix = "data:image/png;base64," + image.getLink();
        image.setLink(base64WithPrefix);
        return imageRepository.save(image);
    }

    @Override
    public void deleteById(Long id) {
        imageRepository.deleteById(id);
    }

    @Override
    public Optional<Image> findByLink(String link) {
        return imageRepository.findByLink(link);
    }
}