package com.pizzaria.pedido.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PedidoResponseDTO {
    private Long id;
    private String clienteNome;
    private String status;
    private BigDecimal total;
}
