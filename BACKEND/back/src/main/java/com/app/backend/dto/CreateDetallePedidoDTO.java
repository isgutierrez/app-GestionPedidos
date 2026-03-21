package com.app.backend.dto;

import java.math.BigDecimal;

public class CreateDetallePedidoDTO {

    private Long productoId;
    private Integer cantidad;

    public Long getProductoId() {
        return productoId;
    }

    public Integer getCantidad() {
        return cantidad;
    }
}
