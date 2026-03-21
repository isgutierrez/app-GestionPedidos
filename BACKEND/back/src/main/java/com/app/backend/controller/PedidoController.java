package com.app.backend.controller;

import com.app.backend.dto.CreatePedidoDTO;
import com.app.backend.dto.UpdateEstadoPedidoDTO;
import com.app.backend.entity.Pedido;
import com.app.backend.service.PedidoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin("*")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    // Crear pedido (cliente)
    @PostMapping
    public Pedido crearPedido(@RequestBody CreatePedidoDTO dto) {
        return service.crearPedido(dto);
    }

    // Listar pedidos
    @GetMapping
    public List<Pedido> getPedidos() {
        return service.getAllPedidos();
    }

    // Eliminar pedido
    @DeleteMapping("/{id}")
    public void eliminarPedido(@PathVariable Integer id) {
        service.eliminarPedido(id);
    }

    // Actualizar estado (ADMIN / COCINERO)
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'COCINERO')")
    public Pedido actualizarEstadoPedido(
            @PathVariable Integer id,
            @RequestBody UpdateEstadoPedidoDTO dto) {

        return service.actualizarEstadoPedido(id, dto.getEstado());
    }
}
