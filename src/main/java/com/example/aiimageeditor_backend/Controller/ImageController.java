package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.Model.Image;
import com.example.aiimageeditor_backend.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.URL;
import java.util.Optional;

import org.apache.commons.io.IOUtils;

@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService i;
    private static final String UPLOAD_DIR = "src/main/resources/static";

    @PostMapping("/save")
    public String saveImage(@RequestBody Image image) throws IOException {
        URL url = new URL(image.getLink());
        byte[] imageData = IOUtils.toByteArray(url);
        String img = java.util.Base64.getEncoder().encodeToString(imageData);
        image.setLink(img);
        i.saveImage(image);
        return img;
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

}
