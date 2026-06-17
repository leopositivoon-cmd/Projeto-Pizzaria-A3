# Microserviço de Pedidos (`pedido-service`)

Este microserviço gerencia os pedidos da pizzaria, integrando-se com o `cliente-service` para associar clientes aos pedidos.

## Tecnologias Utilizadas
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Cloud OpenFeign (comunicação REST)
- MySQL
- OpenAPI/Swagger (documentação)

## Como Rodar

A forma recomendada de executar este serviço é através do **Docker Compose** na raiz da pasta `backend`.

Se desejar rodar manualmente:
1.  Certifique-se de ter um banco MySQL rodando.
2.  Garanta que o `cliente-service` esteja acessível.
3.  Ajuste o `application.properties` para apontar para `localhost`.
4.  Execute:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

## Endpoints da API

- `GET /pedidos`: Lista todos os pedidos.
- `GET /pedidos/{id}`: Busca um pedido pelo ID.
- `POST /pedidos`: Cria um novo pedido (integra com `cliente-service`).
- `PUT /pedidos/{id}`: Atualiza os dados de um pedido.
- `PUT /pedidos/{id}/status`: Avança o status do pedido (RECEBIDO -> EM_PREPARO -> PRONTO -> ENTREGUE).
- `DELETE /pedidos/{id}`: Remove um pedido.

## Integração entre Microserviços
O `pedido-service` consome o `cliente-service` via FeignClient. No ambiente Docker, a URL utilizada é `http://cliente-service:8081`.

## Documentação
A documentação da API via Swagger/OpenAPI pode ser acessada em: `http://localhost:8080/swagger-ui/index.html` (quando o serviço estiver rodando ).
