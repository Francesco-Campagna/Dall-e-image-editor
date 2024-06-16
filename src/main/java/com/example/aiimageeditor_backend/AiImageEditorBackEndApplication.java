package com.example.aiimageeditor_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@SpringBootApplication
public class AiImageEditorBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiImageEditorBackEndApplication.class, args);
    }



}
