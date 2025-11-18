package com.app.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String correo;
    private String contrasena;
}
