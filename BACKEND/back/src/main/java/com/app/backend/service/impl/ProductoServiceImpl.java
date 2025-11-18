package com.app.backend.service.impl;

import com.app.backend.entity.Producto;
import com.app.backend.repository.ProductoRepository;
import com.app.backend.service.ProductoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    @Override
    public Producto getById(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    @Override
    public Producto create(Producto producto) {
        return productoRepository.save(producto);
    }

    @Override
    public Producto update(Integer id, Producto producto) {
        Producto existente = getById(id);

        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecio(producto.getPrecio());
        existente.setImagen(producto.getImagen());
        existente.setCategoria(producto.getCategoria());

        return productoRepository.save(existente);
    }

    @Override
    public void delete(Integer id) {
        productoRepository.deleteById(id);
    }
}