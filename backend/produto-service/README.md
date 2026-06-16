# Microserviço de Produtos (`produto-service`)

Este microserviço é responsável por gerenciar o cardápio da pizzaria, incluindo pizzas, bebidas e bordas.

## Tecnologias Utilizadas
- Java 17
- Spring Boot 3.x
- Spring Data JPA
- H2 Database (em memória para desenvolvimento)
- MySQL Connector/J
- Lombok

## Como Rodar

1.  **Pré-requisitos:**
    - Java Development Kit (JDK) 17 ou superior
    - Apache Maven

2.  **Compilar e Executar (com H2 - banco em memória):**
    ```bash
    cd /home/ubuntu/pizzaria-backend/produto-service
    mvn clean install
    mvn spring-boot:run
    ```

    O serviço será iniciado na porta `8082`.

## Configuração do Banco de Dados (MySQL)

Para usar o MySQL (conforme requisito do projeto A3):

1.  **Crie o banco de dados:** Certifique-se de ter um servidor MySQL rodando e crie um banco de dados chamado `pizzaria_produtos_db`.
2.  **Edite `application.properties`:** Abra o arquivo `src/main/resources/application.properties`.
3.  **Descomente as linhas do MySQL:**
    ```properties
    # spring.datasource.url=jdbc:mysql://localhost:3306/pizzaria_produtos_db?createDatabaseIfNotExist=true
    # spring.datasource.username=root
    # spring.datasource.password=sua_senha
    # spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    # spring.jpa.hibernate.ddl-auto=update
    ```
    Substitua `sua_senha` pela senha do seu usuário `root` do MySQL (ou outro usuário configurado).
4.  **Comente as linhas do H2:** Certifique-se de que as linhas de configuração do H2 estejam comentadas (`#`).
5.  **Reinicie o serviço.**

## Endpoints da API

- `POST /produtos`: Cadastra um novo produto.
- `GET /produtos`: Lista todos os produtos.
- `GET /produtos/{id}`: Busca um produto pelo ID.
- `PUT /produtos/{id}`: Atualiza um produto existente.
- `DELETE /produtos/{id}`: Remove um produto pelo ID.
