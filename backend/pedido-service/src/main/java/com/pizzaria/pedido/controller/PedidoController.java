package com.pizzaria.pedido.controller;

import com.pizzaria.pedido.dto.PedidoInputDTO;
import com.pizzaria.pedido.dto.PedidoResponseDTO;
import com.pizzaria.pedido.model.Pedido;
import com.pizzaria.pedido.service.PedidoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.Parameter;

@Tag(
        name = "Pedidos",
        description = "Operações relacionadas aos pedidos da pizzaria"
)
@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService service;

    @Operation(
            summary = "Criar pedido",
            description = "Cria um novo pedido na pizzaria"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pedido criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public Pedido create(@Valid @RequestBody PedidoInputDTO input) {
        return service.create(input);
    }

    @Operation(
            summary = "Listar pedidos",
            description = "Retorna todos os pedidos cadastrados"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    })
    @GetMapping
    public List<PedidoResponseDTO> findAll() {
        return service.findAll();
    }

    @Operation(
            summary = "Buscar pedido por ID",
            description = "Retorna um pedido específico pelo identificador"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pedido encontrado"),
            @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> findById(@PathVariable
                                               @Parameter(description = "ID do pedido")
                                               Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Atualizar status do pedido",
            description = "Avança o status do pedido para a próxima etapa"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status atualizado"),
            @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> updateStatus(@PathVariable Long id) {
        return service.updateStatus(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Editar pedido",
            description = "Atualiza os dados de um pedido existente"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pedido atualizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> update(@PathVariable Long id,
                                         @Valid @RequestBody PedidoInputDTO input) {
        return service.update(id, input)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
            summary = "Excluir pedido",
            description = "Remove um pedido do sistema"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pedido removido"),
            @ApiResponse(responseCode = "404", description = "Pedido não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}