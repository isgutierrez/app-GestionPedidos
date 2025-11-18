package com.app.backend.dto;

import lombok.Data;

@Data
public class CreateDetallePedidoDTO {
    private Integer idProducto;
    private Integer cantidad;
    private String observaciones;
}
