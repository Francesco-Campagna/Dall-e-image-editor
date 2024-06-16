package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.Entities.Image;
import com.example.aiimageeditor_backend.Service.ImageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService i;
    private static final String UPLOAD_DIR = "src/main/resources/static";

    @PostMapping("/save")
    public void saveImage(@RequestBody String imageData) throws IOException {
        // ObjectMapper per deserializzare JSON
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(imageData);

        // Recupera i dati dall'oggetto JSON
        String link = jsonNode.get("link").asText();
        String chatTitle = jsonNode.get("chatTitle").asText();
        Long userId = jsonNode.get("userId").asLong();

        // Esegui le operazioni necessarie sul link dell'immagine
        URL url = new URL(link);
        byte[] imageBytes = IOUtils.toByteArray(url);
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        System.out.println(base64Image);

        // Salvataggio dell'immagine e creazione della chat nel service
        i.saveImageAndCreateChat(base64Image, chatTitle, userId);

    }

    @GetMapping("getImage/{id}")
    public Optional<Image> getImageById(@PathVariable String id){
        return i.getImageById(Long.valueOf(id));
    }


    @GetMapping("/{filename}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String filename) throws IOException {
        String IMAGE_DIR = "src/main/resources/static/";


        File file = new File(IMAGE_DIR + File.separator + filename);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.length())
                .body(resource);
    }


    @PostMapping("/createMask")
    public ResponseEntity<byte[]> createMask(@RequestParam(value = "image") MultipartFile image,
                                             @RequestParam(value = "top") String top,
                                             @RequestParam(value = "left") String left,
                                             @RequestParam(value = "width") String width,
                                             @RequestParam(value = "height") String height) throws IOException {

        BufferedImage img = this.i.readSelectedImage(image);

        if (img != null) {
            int topInt = this.i.convertPixelStringToInt(top);
            int leftInt = this.i.convertPixelStringToInt(left);
            int widthInt = this.i.convertPixelStringToInt(width);
            int heightInt = this.i.convertPixelStringToInt(height);

            Optional<BufferedImage> maskImage = this.i.createMask(img, topInt, leftInt, widthInt, heightInt);

            if (maskImage.isPresent()) {
                // Converte l'immagine in un array di byte
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(maskImage.get(), "png", baos);
                byte[] imageBytes = baos.toByteArray();

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_PNG);

                return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


    @PostMapping("/convert-generated-to-file")
    public ResponseEntity<byte[]> downloadImage(@RequestBody Map<String, String> requestBody) {
        String generatedImage = requestBody.get("generatedImage");
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
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"downloaded-image.png\"");

                return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
            }
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
