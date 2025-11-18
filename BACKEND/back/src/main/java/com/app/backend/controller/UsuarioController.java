package com.app.backend.controller;

import com.app.backend.entity.Usuario;
import com.app.backend.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Usuario getById(@PathVariable Integer id) {
        return service.getById(id);
    }

    @PostMapping
    public Usuario create(@RequestBody Usuario u) {
        return service.create(u);
    }

    @PutMapping("/{id}")
    public Usuario update(@PathVariable Integer id, @RequestBody Usuario u) {
        return service.update(id, u);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}