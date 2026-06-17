# Microserviço de Clientes (`cliente-service`)

Este microserviço é responsável pelo gerenciamento de clientes da pizzaria, fornecendo operações de cadastro, consulta, atualização e remoção.

## Tecnologias Utilizadas
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- MySQL
- Lombok

## Como Rodar

A forma recomendada de executar este serviço é através do **Docker Compose** na raiz da pasta `backend`, que já configura o banco de dados e as redes necessárias.

Se desejar rodar manualmente para desenvolvimento:
1.  Certifique-se de ter um banco MySQL rodando.
2.  Ajuste o `application.properties` para apontar para `localhost:3306`.
3.  Execute:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

## Endpoints da API

- `GET /clientes`: Lista todos os clientes.
- `GET /clientes/{id}`: Busca um cliente pelo ID.
- `GET /clientes/telefone/{telefone}`: Busca um cliente pelo número de telefone.
- `POST /clientes`: Cadastra um novo cliente.
- `PUT /clientes/{id}`: Atualiza os dados de um cliente existente.
- `DELETE /clientes/{id}`: Remove um cliente.

## Configuração de Banco de Dados
O serviço utiliza o banco de dados MySQL chamado `pizzaria`. No ambiente Docker, ele se conecta via `jdbc:mysql://mysql:3306/pizzaria`.
