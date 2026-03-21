package com.app.backend.service;

import com.app.backend.dto.CreatePedidoDTO;
import com.app.backend.entity.EstadoPedido;
import com.app.backend.entity.Pedido;

import java.util.List;

public interface PedidoService {

    Pedido crearPedido(CreatePedidoDTO dto);

    Pedido actualizarEstadoPedido(Integer id, EstadoPedido nuevoEstado);
    void eliminarPedido(Integer id);

    List<Pedido> getAllPedidos();
}
