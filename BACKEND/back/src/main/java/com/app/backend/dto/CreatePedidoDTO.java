package com.app.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreatePedidoDTO {

    private Integer idCliente;
    private Integer idMesa;
    private List<CreateDetallePedidoDTO> detalles;
}
