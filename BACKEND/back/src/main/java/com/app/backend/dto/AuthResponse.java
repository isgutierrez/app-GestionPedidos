package com.app.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String mensaje;
    private Integer id;
    private String correo;
}
