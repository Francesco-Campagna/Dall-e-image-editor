package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Persistence.DAO.ChatDao;
import com.example.aiimageeditor_backend.Persistence.DAO.ImageDao;
import com.example.aiimageeditor_backend.Persistence.DAO.UserDao;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import com.example.aiimageeditor_backend.Persistence.Entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageDao imageDao;
    private final UserDao userDao;
    private final ChatDao chatDao;

    @Autowired
    public ImageServiceImpl(ImageDao imageDao, UserDao userDao, ChatDao chatDao) {
        this.imageDao = imageDao;
        this.userDao = userDao;
        this.chatDao = chatDao;
    }

    @Override
    public Optional<Image> getImageById(Long id) {
        return imageDao.findById(id);
    }

    @Override
    public List<Image> getAllImages() {
        return imageDao.findAll();
    }

    @Override
    public void deleteImage(Long id) {
        imageDao.deleteById(id);
    }


    @Override
    public List<Image> findByChatId(Long chatId) {
        return imageDao.findByChatId(chatId);
    }

    @Override
    public Optional<BufferedImage> createMask(BufferedImage image, int top, int left, int width, int height) {
        try {
            if (image.getType() != BufferedImage.TYPE_INT_ARGB) {
                BufferedImage temp = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_ARGB);
                Graphics2D g2d = temp.createGraphics();
                g2d.drawImage(image, 0, 0, null);
                g2d.dispose();
                image = temp;
            }

            Graphics2D g2d = image.createGraphics();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setComposite(AlphaComposite.Clear);
            g2d.fillRect(left, top, width, height);
            g2d.dispose();

            return Optional.of(image);

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Override
    public BufferedImage readSelectedImage(MultipartFile selectedImage) throws IOException {
        return ImageIO.read(selectedImage.getInputStream());
    }

    @Override
    public int convertPixelStringToInt(String value) {
        Pattern pattern = Pattern.compile("(\\d+)px");
        Matcher matcher = pattern.matcher(value);

        if (matcher.find()) {
            String numeroStringa = matcher.group(1);
            return Integer.parseInt(numeroStringa);
        } else {
            System.out.println("Nessun numero trovato nella stringa");
        }
        return -1;
    }

    @Override
    public void saveImageAndCreateChat(String base64Image, String chatTitle, Long userId) {
        // Creazione della nuova chat
        Chat chat = new Chat();
        chat.setTitle(chatTitle);

        // Recupero dell'utente dal repository
        Optional<User> userOptional = userDao.findById(userId);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("Utente non trovato con ID: " + userId);
        }
        User user = userOptional.get();

        Image image = new Image();
        image.setImageData("data:image/png;base64," + base64Image);
        image.setChat(chat);

        // Collegamento dell'immagine alla chat e all'utente
        chat.setImage(image);
        chat.setUser(user);

        // Salvataggio dell'immagine e della chat
        imageDao.save(image); // Salva prima l'immagine per generare l'ID
        chatDao.save(chat);

    }
}
