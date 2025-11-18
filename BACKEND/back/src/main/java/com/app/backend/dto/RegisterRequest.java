package com.app.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String correo;
    private String nombre;
    private String contrasena;
    private String rol;
}
