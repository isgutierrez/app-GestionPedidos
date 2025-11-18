package com.app.backend.controller;

import com.app.backend.dto.CreatePedidoDTO;
import com.app.backend.entity.Pedido;
import com.app.backend.service.PedidoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin("*")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    public Pedido crearPedido(@RequestBody CreatePedidoDTO dto) {
        return service.crearPedido(dto);
    }

    @GetMapping
    public List<Pedido> getPedidos() {
        return service.getAllPedidos();
    }
}
