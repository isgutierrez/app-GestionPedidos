package com.app.backend.service.impl;

import com.app.backend.entity.Usuario;
import com.app.backend.repository.UsuarioRepository;
import com.app.backend.service.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Usuario> getAll() {
        return repo.findAll();
    }

    @Override
    public Usuario getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public Usuario create(Usuario u) {
        if (repo.existsByCorreo(u.getCorreo())) {
            throw new RuntimeException("El correo ya está en uso");
        }

        u.setContrasena(passwordEncoder.encode(u.getContrasena()));

        return repo.save(u);
    }

    @Override
    public Usuario update(Integer id, Usuario u) {
        Usuario db = getById(id);

        db.setNombre(u.getNombre());
        db.setRol(u.getRol());

        if (u.getContrasena() != null && !u.getContrasena().isBlank()) {
            db.setContrasena(passwordEncoder.encode(u.getContrasena()));
        }

        return repo.save(db);
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
