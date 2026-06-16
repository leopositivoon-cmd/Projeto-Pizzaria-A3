package com.pizzaria.produto.service;

import com.pizzaria.produto.model.Produto;
import com.pizzaria.produto.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository repository;

    public List<Produto> findAll() {
        return repository.findAll();
    }

    public Optional<Produto> findById(Long id) {
        return repository.findById(id);
    }

    public Produto save(Produto produto) {
        return repository.save(produto);
    }

    public Optional<Produto> update(Long id, Produto details) {
        return repository.findById(id).map(produto -> {
            produto.setNome(details.getNome());
            produto.setTipo(details.getTipo());
            produto.setPreco(details.getPreco());
            produto.setDescricao(details.getDescricao());
            return repository.save(produto);
        });
    }

    public boolean delete(Long id) {
        return repository.findById(id).map(produto -> {
            repository.delete(produto);
            return true;
        }).orElse(false);
    }
}
