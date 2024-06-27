package com.example.aiimageeditor_backend.Persistence.DTO;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
