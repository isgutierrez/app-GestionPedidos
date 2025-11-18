package com.app.backend.service;


import com.app.backend.entity.Producto;
import java.util.List;

public interface ProductoService {

    List<Producto> getAll();
    Producto getById(Integer id);
    Producto create(Producto producto);
    Producto update(Integer id, Producto producto);
    void delete(Integer id);
}