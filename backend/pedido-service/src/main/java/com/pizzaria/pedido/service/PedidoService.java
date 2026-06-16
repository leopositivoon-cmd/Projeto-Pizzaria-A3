package com.pizzaria.pedido.service;

import com.pizzaria.pedido.client.ClienteClient;
import com.pizzaria.pedido.dto.ClienteDTO;
import com.pizzaria.pedido.dto.PedidoInputDTO;
import com.pizzaria.pedido.dto.PedidoResponseDTO;
import com.pizzaria.pedido.model.ItemPedido;
import com.pizzaria.pedido.model.Pedido;
import com.pizzaria.pedido.repository.PedidoRepository;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository repository;

    @Autowired
    private ClienteClient clienteClient;

    public List<PedidoResponseDTO> findAll() {
        return repository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public Optional<Pedido> findById(Long id) {
        return repository.findById(id);
    }

    public Pedido create(PedidoInputDTO input) {
        ClienteDTO cliente;
        try {
            cliente = clienteClient.findByTelefone(input.getCliente().getTelefone());
        } catch (FeignException.NotFound e) {
            cliente = clienteClient.save(input.getCliente());
        }

        Pedido pedido = new Pedido();
        pedido.setClienteId(cliente.getId());
        pedido.setClienteNome(cliente.getNome());
        pedido.setPagamento(input.getPagamento());
        pedido.setStatus("RECEBIDO");

        List<ItemPedido> itens = input.getItens().stream().map(itemInput -> {
            ItemPedido item = new ItemPedido();
            item.setPizza(itemInput.getPizza());
            item.setSabores(itemInput.getSabores() != null ? String.join(", ", itemInput.getSabores()) : "");
            item.setBorda(itemInput.getBorda());
            item.setBebida(itemInput.getBebida());
            item.setObservacao(itemInput.getObservacao());
            item.setValor(itemInput.getValor());
            return item;
        }).collect(Collectors.toList());

        pedido.setItens(itens);
        return repository.save(pedido);
    }

    public Optional<Pedido> update(Long id, PedidoInputDTO input) {
        return repository.findById(id).map(pedido -> {
            pedido.setPagamento(input.getPagamento());
            // Outras atualizações se necessário
            return repository.save(pedido);
        });
    }

    public Optional<Pedido> updateStatus(Long id) {
        return repository.findById(id).map(pedido -> {
            String currentStatus = pedido.getStatus();
            String nextStatus = switch (currentStatus) {
                case "RECEBIDO" -> "EM_PREPARO";
                case "EM_PREPARO" -> "PRONTO";
                case "PRONTO" -> "ENTREGUE";
                default -> currentStatus;
            };
            pedido.setStatus(nextStatus);
            return repository.save(pedido);
        });
    }

    public boolean delete(Long id) {
        return repository.findById(id).map(pedido -> {
            repository.delete(pedido);
            return true;
        }).orElse(false);
    }

    private PedidoResponseDTO toResponseDTO(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setId(pedido.getId());
        dto.setClienteNome(pedido.getClienteNome());
        dto.setStatus(pedido.getStatus());
        dto.setTotal(pedido.getTotal());
        return dto;
    }
}
