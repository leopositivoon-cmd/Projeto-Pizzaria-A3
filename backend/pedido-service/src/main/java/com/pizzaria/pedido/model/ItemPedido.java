package com.pizzaria.pedido.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pizza;
    private String sabores; // Armazenado como String separada por vírgula para simplicidade
    private String borda;
    private String bebida;
    private String observacao;

    @NotNull(message = "O valor do item é obrigatório")
    @Positive(message = "O valor do item deve ser positivo")
    private BigDecimal valor;
}
