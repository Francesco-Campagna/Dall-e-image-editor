package com.example.aiimageeditor_backend.Controller;

import com.example.aiimageeditor_backend.Persistence.Entities.Chat;
import com.example.aiimageeditor_backend.Service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;


@RestController
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService i;
    @PostMapping("/save")
    public void saveImage(@RequestBody String imageData) throws IOException {
        i.saveImageAndCreateChat(imageData);
    }


    @PostMapping("/createMask")
    public ResponseEntity<byte[]> createMask(@RequestParam(value = "image") MultipartFile image,
                                       @RequestParam(value = "top") String top,
                                       @RequestParam(value = "left") String left,
                                       @RequestParam(value = "width") String width,
                                       @RequestParam(value = "height") String height) throws IOException {

        return i.createMask(image, top, left, width, height);
    }


    @PostMapping("/convert-generated-to-file")
    public ResponseEntity<byte[]> downloadImage(@RequestBody Map<String, String> requestBody) {
        return i.convertGeneratedToFile(requestBody);
    }


    @DeleteMapping("/delete/{chat}")
    public void deleteChat(@PathVariable Chat chat){
        try{
            i.deleteById(chat.getImage().getId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
}
