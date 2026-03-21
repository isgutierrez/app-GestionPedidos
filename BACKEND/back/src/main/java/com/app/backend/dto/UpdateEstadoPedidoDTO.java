package com.app.backend.dto;

import com.app.backend.entity.EstadoPedido;

public class UpdateEstadoPedidoDTO {

    private EstadoPedido estado;

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }
}
