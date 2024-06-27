package com.example.aiimageeditor_backend.Persistence.DTO;

import lombok.Data;

@Data
public class RegistrationRequestDto {
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String password;
}
