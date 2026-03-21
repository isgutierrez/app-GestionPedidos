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
import java.time.LocalDateTime;
import com.app.backend.entity.EstadoPedido;

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

        Pedido pedido = new Pedido();
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado(EstadoPedido.PENDIENTE);

        List<DetallePedido> detalles = new ArrayList<>();

        for (var detalleDTO : dto.getDetalles()) {

            Integer productoId = detalleDTO.getProductoId().intValue();

            Producto producto = productoRepo.findById(productoId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPedido(pedido);

            detalles.add(detalle);
        }

        pedido.setDetalles(detalles);
        return pedidoRepo.save(pedido);
    }



    @Override
    public List<Pedido> getAllPedidos() {
        return pedidoRepo.findAll();
    }

    @Override
    public void eliminarPedido(Integer id)     {
        if (!pedidoRepo.existsById(id)){
            throw new RuntimeException("El pedido no existe");
        }
        pedidoRepo.deleteById(id);
    }

    @Override
    public Pedido actualizarEstadoPedido(Integer id, EstadoPedido nuevoEstado) {

        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);
        return pedidoRepo.save(pedido);
    }
}
