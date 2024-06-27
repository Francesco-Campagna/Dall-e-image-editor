package com.example.aiimageeditor_backend.Service;

import com.example.aiimageeditor_backend.Config.JwtTokenUtil;
import com.example.aiimageeditor_backend.Persistence.DAO.ChatDao;
import com.example.aiimageeditor_backend.Persistence.DAO.ImageDao;
import com.example.aiimageeditor_backend.Persistence.DAO.UserDao;
import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import com.example.aiimageeditor_backend.Persistence.Entities.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ImageServiceImpl implements ImageService {

    private final ImageDao imageDao;
    private final UserDao userDao;
    private final ChatDao chatDao;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public ImageServiceImpl(ImageDao imageDao, UserDao userDao, ChatDao chatDao, JwtTokenUtil jwtTokenUtil) {
        this.imageDao = imageDao;
        this.userDao = userDao;
        this.chatDao = chatDao;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public Optional<Image> getImageById(Long id) {
        return imageDao.findById(id);
    }


    @Override
    public ResponseEntity<byte[]> createMask(MultipartFile image, String top, String left, String width, String height) throws IOException {
        // Leggi l'immagine dal MultipartFile
        BufferedImage img = ImageIO.read(image.getInputStream());


        if (img != null) {
            // Converti i parametri in interi
            int topInt = convertPixelStringToInt(top);
            int leftInt = convertPixelStringToInt(left);
            int widthInt = convertPixelStringToInt(width);
            int heightInt = convertPixelStringToInt(height);

            // Crea la maschera
            if (img.getType() != BufferedImage.TYPE_INT_ARGB) {
                BufferedImage temp = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_INT_ARGB);
                Graphics2D g2d = temp.createGraphics();
                g2d.drawImage(img, 0, 0, null);
                g2d.dispose();
                img = temp;
            }

            Graphics2D g2d = img.createGraphics();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setComposite(AlphaComposite.Clear);
            g2d.fillRect(leftInt, topInt, widthInt, heightInt);
            g2d.dispose();

            // Converti l'immagine in un array di byte
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(img, "png", baos);
            byte[] imageBytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


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
    public void saveImageAndCreateChat(String imageData) throws IOException {
        // ObjectMapper per deserializzare JSON
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(imageData);

        // Recupera i dati dall'oggetto JSON
        String link = jsonNode.get("link").asText();
        String chatTitle = jsonNode.get("chatTitle").asText();
        String token = jsonNode.get("token").asText();

        // Esegui le operazioni necessarie sul link dell'immagine
        URL url = new URL(link);
        byte[] imageBytes = IOUtils.toByteArray(url);
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);


        // Creazione della nuova chat
        Chat chat = new Chat();
        chat.setTitle(chatTitle);

        // Recupero dell'utente dal repository
        String email = jwtTokenUtil.extractUsername(token);
        Optional<User> userOptional = Optional.ofNullable(userDao.findByEmail(email));
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("Utente non trovato con ID: " + email);
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


    @Override
    public ResponseEntity<byte[]> convertGeneratedToFile(Map<String, String> requestBody) {
        String generatedImage = requestBody.get("generatedImage");
        String fileName = requestBody.get("fileName");
        if (fileName == null || fileName.isEmpty()) {
            fileName = "downloaded-image.png"; // Default file name
        }
        try {
            URL url = new URL(generatedImage);
            try (BufferedInputStream in = new BufferedInputStream(url.openStream());
                 ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = in.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
                byte[] imageData = out.toByteArray();

                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_TYPE, "image/png");
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");

                return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteById(Long id){
        imageDao.deleteById(id);
    }


}
