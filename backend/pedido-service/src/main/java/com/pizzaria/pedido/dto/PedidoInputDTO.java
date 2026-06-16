package com.pizzaria.pedido.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PedidoInputDTO {
    @NotNull(message = "Os dados do cliente são obrigatórios")
    @Valid
    private ClienteDTO cliente;

    @NotBlank(message = "A forma de pagamento é obrigatória")
    private String pagamento;

    @NotEmpty(message = "O pedido deve conter pelo menos um item")
    @Valid
    private List<ItemInputDTO> itens;

    private BigDecimal total;

    @Data
    public static class ItemInputDTO {
        private String pizza;
        private List<String> sabores;
        private String borda;
        private String bebida;
        private String observacao;

        @NotNull(message = "O valor do item é obrigatório")
        private BigDecimal valor;
    }
}
