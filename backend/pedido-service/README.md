# Microserviço de Pedidos (`pedido-service`)

Este microserviço é responsável por gerenciar os pedidos da pizzaria, incluindo o carrinho, checkout e o status do pedido. Ele se integra com o `cliente-service` para gerenciar os dados dos clientes.

## Tecnologias Utilizadas
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- Spring Cloud OpenFeign (para comunicação entre microserviços)
- H2 Database (em memória para desenvolvimento)
- MySQL Connector/J
- Lombok

## Como Rodar

1.  **Pré-requisitos:**
    - Java Development Kit (JDK) 17 ou superior
    - Apache Maven
    - Os microserviços `cliente-service` (porta `8081`) e `produto-service` (porta `8082`) devem estar rodando antes de iniciar este serviço.

2.  **Compilar e Executar (com H2 - banco em memória):**
    ```bash
    cd /home/ubuntu/pizzaria-backend/pedido-service
    mvn clean install
    mvn spring-boot:run
    ```

    O serviço será iniciado na porta `8080`.

## Configuração do Banco de Dados (MySQL)

Para usar o MySQL (conforme requisito do projeto A3):

1.  **Crie o banco de dados:** Certifique-se de ter um servidor MySQL rodando e crie um banco de dados chamado `pizzaria_pedidos_db`.
2.  **Edite `application.properties`:** Abra o arquivo `src/main/resources/application.properties`.
3.  **Descomente as linhas do MySQL:**
    ```properties
    # spring.datasource.url=jdbc:mysql://localhost:3306/pizzaria_pedidos_db?createDatabaseIfNotExist=true
    # spring.datasource.username=root
    # spring.datasource.password=sua_senha
    # spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    # spring.jpa.hibernate.ddl-auto=update
    ```
    Substitua `sua_senha` pela senha do seu usuário `root` do MySQL (ou outro usuário configurado).
4.  **Comente as linhas do H2:** Certifique-se de que as linhas de configuração do H2 estejam comentadas (`#`).
5.  **Reinicie o serviço.**

## Endpoints da API

- `POST /pedidos`: Cria um novo pedido. Este endpoint se comunica com o `cliente-service` para verificar e/ou cadastrar o cliente.
- `GET /pedidos`: Lista todos os pedidos, retornando a estrutura simplificada: `{"id": 1, "clienteNome": "João Silva", "status": "EM_PREPARO", "total": 99.90}`.
- `GET /pedidos/{id}`: Busca um pedido pelo ID.
- `PUT /pedidos/{id}/status`: Atualiza o status de um pedido (RECEBIDO -> EM_PREPARO -> PRONTO -> ENTREGUE).
- `DELETE /pedidos/{id}`: Remove um pedido pelo ID.

## Integração com `cliente-service`

O `pedido-service` utiliza o Feign Client para se comunicar com o `cliente-service`. As chamadas são feitas para a URL `http://localhost:8081`.

- Ao receber um `POST /pedidos`, o `pedido-service` tenta buscar o cliente pelo telefone no `cliente-service` (`GET /clientes/telefone/{telefone}`).
- Se o cliente não for encontrado, ele é cadastrado no `cliente-service` (`POST /clientes`).
- O `clienteId` e `clienteNome` são então utilizados para salvar o pedido no banco de dados do `pedido-service`.
