package com.app.backend.service;

import com.app.backend.entity.Usuario;
import java.util.List;

public interface UsuarioService {

    List<Usuario> getAll();

    Usuario getById(Integer id);

    Usuario create(Usuario u);

    Usuario update(Integer id, Usuario u);

    void delete(Integer id);
}
