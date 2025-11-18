package com.app.backend.service.impl;

import com.app.backend.dto.AuthRequest;
import com.app.backend.dto.AuthResponse;
import com.app.backend.dto.RegisterRequest;
import com.app.backend.entity.Usuario;
import com.app.backend.repository.UsuarioRepository;
import com.app.backend.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (repo.existsByCorreo(request.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario u = Usuario.builder()
                .correo(request.getCorreo())
                .nombre(request.getNombre())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .rol(request.getRol())
                .build();

        Usuario saved = repo.save(u);

        return new AuthResponse("Registro exitoso", saved.getIdUsuario(), saved.getCorreo());
    }

    @Override
    public AuthResponse login(AuthRequest request) {

        Usuario u = repo.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasena(), u.getContrasena())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        return new AuthResponse("Autenticación satisfactoria", u.getIdUsuario(), u.getCorreo());
    }

}
