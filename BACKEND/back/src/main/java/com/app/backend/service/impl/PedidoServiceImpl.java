package com.app.backend.service.impl;

import com.app.backend.dto.CreatePedidoDTO;
import com.app.backend.entity.DetallePedido;
import com.app.backend.entity.Pedido;
import com.app.backend.entity.Producto;
import com.app.backend.repository.DetallePedidoRepository;
import com.app.backend.repository.PedidoRepository;
import com.app.backend.repository.ProductoRepository;
import com.app.backend.service.PedidoService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepo;
    private final ProductoRepository productoRepo;
    private final DetallePedidoRepository detalleRepo;

    public PedidoServiceImpl(PedidoRepository pedidoRepo, ProductoRepository productoRepo,
                             DetallePedidoRepository detalleRepo) {
        this.pedidoRepo = pedidoRepo;
        this.productoRepo = productoRepo;
        this.detalleRepo = detalleRepo;
    }

    @Override
    public Pedido crearPedido(CreatePedidoDTO dto) {
        // tu lógica actual para crear pedidos
        return null; // reemplazar por la implementación que ya tienes
    }

    @Override
    public List<Pedido> getAllPedidos() {
        return pedidoRepo.findAll();
    }
}
