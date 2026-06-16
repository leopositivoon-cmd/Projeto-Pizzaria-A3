package com.pizzaria.pedido.client;

import com.pizzaria.pedido.dto.ClienteDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "cliente-service", url = "${cliente-service.url}")
public interface ClienteClient {

    @GetMapping("/clientes/telefone/{telefone}")
    ClienteDTO findByTelefone(@PathVariable("telefone") String telefone);

    @PostMapping("/clientes")
    ClienteDTO save(@RequestBody ClienteDTO cliente);
}
