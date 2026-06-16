# 🍕 Pizzaria Vitoriana - Sistemas Distribuídos (Trabalho A3)

Este projeto foi desenvolvido para atender aos requisitos da atividade **A3 da disciplina de Sistemas Distribuídos**. A solução aplica os conceitos de **arquitetura de microserviços**, **separação de responsabilidades** e **comunicação REST entre sistemas**.

## 🏛️ Arquitetura do Sistema

Conforme solicitado no enunciado, a solução é composta por **3 microserviços independentes**, cada um com seu domínio e responsabilidade:

1.  **Pedido Service (Porta 8080)**: Centraliza a lógica de vendas, segurança (JWT) e orquestração do pedido.
2.  **Cliente Service (Porta 8081)**: Responsável pelo gerenciamento (CRUD) de clientes.
3.  **Produto Service (Porta 8082)**: Responsável pelo gerenciamento (CRUD) do cardápio (pizzas, bebidas, etc.).

### 🔄 Integração entre Microserviços (Requisito Obrigatório)
O sistema demonstra o conceito de sistemas distribuídos através da comunicação síncrona entre serviços:
- Ao finalizar um pedido, o **Pedido Service** consome o **Cliente Service** via **API REST (HTTP)** para verificar se o cliente já existe ou realizar um novo cadastro automaticamente.

## 🚀 Como Executar

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo
1.  Extraia o projeto.
2.  Na pasta raiz (onde está este README), execute:
    ```bash
    docker compose up -d --build
    ```
3.  Aguarde o carregamento dos containers.
4.  Acesse o Frontend: Abra o arquivo `frontend/pages/index.html` no seu navegador.

## ✅ Requisitos Atendidos (Checklist PDF)
- [x] **Mínimo 3 microserviços**: Implementados `pedido`, `cliente` e `produto`.
- [x] **Comunicação REST**: Integração obrigatória entre `pedido-service` e `cliente-service`.
- [x] **CRUD Completo**: Implementado para as 3 entidades (POST, GET, PUT, DELETE).
- [x] **MySQL**: Utilizado como banco de dados persistente para todos os serviços.
- [x] **Separação em Camadas**: Organização rigorosa em Controller, Service e Repository.
- [x] **Diferenciais**: Uso de DTOs, Exception Handler Global, BigDecimal para valores financeiros e Segurança com JWT.

## 🔑 Acesso Administrativo
Para gerenciar pedidos, produtos e clientes:
- **Página**: `frontend/pages/login.html`
- **Usuário**: `admin`
- **Senha**: `admin123`

## 🛠️ Endpoints Principais (API REST)

### Pedido Service (8080)
- `GET /pedidos` - Listar todos os pedidos (Protegido)
- `POST /pedidos` - Criar novo pedido (Público)
- `PUT /pedidos/{id}/status` - Avançar status do pedido (Protegido)
- `DELETE /pedidos/{id}` - Remover pedido (Protegido)
- `POST /auth/login` - Autenticação administrativa

### Cliente Service (8081)
- `GET /clientes` - Listar todos os clientes
- `GET /clientes/buscar?telefone=...` - Buscar por telefone
- `POST /clientes` - Cadastrar novo cliente
- `DELETE /clientes/{id}` - Remover cliente

### Produto Service (8082)
- `GET /produtos` - Listar cardápio
- `POST /produtos` - Adicionar novo produto (Protegido)
- `PUT /produtos/{id}` - Editar produto (Protegido)
- `DELETE /produtos/{id}` - Remover produto (Protegido)

## 🏗️ Padrões de Projeto Aplicados
- **DTO (Data Transfer Object)**: Utilizado para trafegar dados entre as camadas sem expor as entidades JPA.
- **Global Exception Handler**: Tratamento centralizado de erros com `@RestControllerAdvice`.
- **Injeção de Dependência**: Uso rigoroso do Spring IoC.
- **Segurança**: Autenticação baseada em **JWT (JSON Web Token)**.

