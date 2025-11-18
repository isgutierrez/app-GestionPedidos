package com.app.backend.service;

import com.app.backend.dto.CreatePedidoDTO;
import com.app.backend.entity.Pedido;
import java.util.List;

public interface PedidoService {

    Pedido crearPedido(CreatePedidoDTO dto);

    List<Pedido> getAllPedidos();
}
