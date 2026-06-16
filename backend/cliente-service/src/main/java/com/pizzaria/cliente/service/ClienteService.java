package com.pizzaria.cliente.service;

import com.pizzaria.cliente.model.Cliente;
import com.pizzaria.cliente.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository repository;

    public List<Cliente> findAll() {
        return repository.findAll();
    }

    public Optional<Cliente> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<Cliente> findByTelefone(String telefone) {
        return repository.findByTelefone(telefone);
    }

    public Cliente save(Cliente cliente) {
        return repository.save(cliente);
    }

    public Optional<Cliente> update(Long id, Cliente clienteDetails) {
        return repository.findById(id).map(cliente -> {
            cliente.setNome(clienteDetails.getNome());
            cliente.setTelefone(clienteDetails.getTelefone());
            cliente.setEndereco(clienteDetails.getEndereco());
            cliente.setBairro(clienteDetails.getBairro());
            cliente.setReferencia(clienteDetails.getReferencia());
            return repository.save(cliente);
        });
    }

    public boolean delete(Long id) {
        return repository.findById(id).map(cliente -> {
            repository.delete(cliente);
            return true;
        }).orElse(false);
    }
}
