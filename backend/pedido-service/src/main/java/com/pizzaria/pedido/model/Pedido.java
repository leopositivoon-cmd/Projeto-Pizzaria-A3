package com.pizzaria.pedido.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O ID do cliente é obrigatório")
    private Long clienteId;

    @NotBlank(message = "O nome do cliente é obrigatório")
    private String clienteNome;

    @NotBlank(message = "A forma de pagamento é obrigatória")
    private String pagamento;

    private BigDecimal total;

    private String status; // RECEBIDO, EM_PREPARO, PRONTO, ENTREGUE

    @NotEmpty(message = "O pedido deve conter pelo menos um item")
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "pedido_id")
    private List<ItemPedido> itens;

    @PrePersist
    @PreUpdate
    public void calcularTotal() {
        if (itens != null) {
            this.total = itens.stream()
                    .map(item -> item.getValor() != null ? item.getValor() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        } else {
            this.total = BigDecimal.ZERO;
        }
    }
}
