# Microserviço de Produtos (`produto-service`)

Este microserviço gerencia o catálogo de produtos da pizzaria, incluindo pizzas, bordas e bebidas.

## Tecnologias Utilizadas
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- MySQL
- Lombok

## Como Rodar

A forma recomendada de executar este serviço é através do **Docker Compose** na raiz da pasta `backend`.

Se desejar rodar manualmente:
1.  Certifique-se de ter um banco MySQL rodando.
2.  Ajuste o `application.properties` para apontar para `localhost:3306`.
3.  Execute:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

## Endpoints da API

- `GET /produtos`: Lista todos os produtos (pizzas, bordas e bebidas).
- `GET /produtos/{id}`: Busca um produto pelo ID.
- `POST /produtos`: Cadastra um novo produto.
- `PUT /produtos/{id}`: Atualiza os dados de um produto.
- `DELETE /produtos/{id}`: Remove um produto.

## Configuração de Banco de Dados
O serviço utiliza o banco de dados MySQL chamado `pizzaria`. No ambiente Docker, ele se conecta via `jdbc:mysql://mysql:3306/pizzaria`.
