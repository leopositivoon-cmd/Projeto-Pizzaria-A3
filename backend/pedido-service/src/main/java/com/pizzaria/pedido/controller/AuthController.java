package com.pizzaria.pedido.controller;

import com.pizzaria.pedido.security.TokenService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@Tag(
        name = "Autenticação",
        description = "Operações de login e autenticação"
)
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private TokenService tokenService;

    @Operation(
            summary = "Realizar login",
            description = "Autentica um usuário e retorna um token JWT para acesso aos endpoints protegidos"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Usuário ou senha inválidos")
    })
    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest data) {

        // Usuário fixo conforme solicitado
        if ("admin".equals(data.getLogin()) &&
                "admin123".equals(data.getPassword())) {

            var token = tokenService.generateToken(data.getLogin());

            return ResponseEntity.ok(
                    Map.of("token", token)
            );
        }

        return ResponseEntity.status(401).build();
    }

    @Data
    public static class LoginRequest {
        private String login;
        private String password;
    }
}
