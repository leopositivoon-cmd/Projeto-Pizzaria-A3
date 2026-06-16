/* =========================
   API BACKEND
========================= */
const API_URL = "http://localhost:8080/pedidos";

/* =========================
   ELEMENTOS
========================= */
const listaPedidos = document.getElementById("listaPedidos");
const semPedidos = document.getElementById("semPedidos");
const buscarPedido = document.getElementById("buscarPedido");

let pedidos = [];

/* =========================
   TOKEN
========================= */
function getToken() {
    return localStorage.getItem("token");
}

/* =========================
   BUSCAR PEDIDOS
========================= */
async function carregarPedidos() {

    const token = getToken();

    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada.");
            window.location.href = "login.html";
            return;
        }

        pedidos = await response.json();
        renderizarPedidos(pedidos);

    } catch (error) {

        console.error(error);
        listaPedidos.innerHTML = "";
        semPedidos.style.display = "block";
    }
}

/* =========================
   RENDERIZAR PEDIDOS
========================= */
function renderizarPedidos(lista) {

    listaPedidos.innerHTML = "";

    if (!lista || lista.length === 0) {
        semPedidos.style.display = "block";
        return;
    }

    semPedidos.style.display = "none";

    lista.forEach((pedido) => {

        listaPedidos.innerHTML += `
            <tr>

                <td>#${pedido.id}</td>

                <td>${pedido.clienteNome}</td>

                <td>

                    <select
                        class="select-status"
                        onchange="alterarStatus(${pedido.id}, this.value)">

                        <option value="RECEBIDO" ${pedido.status === "RECEBIDO" ? "selected" : ""}>Recebido</option>

                        <option value="EM_PREPARO" ${pedido.status === "EM_PREPARO" ? "selected" : ""}>Em Preparo</option>

                        <option value="PRONTO" ${pedido.status === "PRONTO" ? "selected" : ""}>Pronto</option>

                        <option value="ENTREGUE" ${pedido.status === "ENTREGUE" ? "selected" : ""}>Entregue</option>

                    </select>

                </td>

                <td>
                    R$ ${Number(pedido.total)
                        .toFixed(2)
                        .replace(".", ",")}
                </td>

                <td>

                    <div class="acoes">

                        <button
                            class="btn-excluir"
                            onclick="excluirPedido(${pedido.id})"
                            title="Excluir">

                            <i class="bi bi-trash-fill"></i>

                        </button>

                    </div>

                </td>

            </tr>
        `;
    });
}

/* =========================
   ALTERAR STATUS
========================= */
async function alterarStatus(id, novoStatus) {

    const token = getToken();

    try {

        const response = await fetch(`${API_URL}/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status: novoStatus
            })
        });

        if (response.ok) {
            carregarPedidos();
        } else {
            alert("Erro ao atualizar status.");
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar status.");
    }
}

/* =========================
   EXCLUIR PEDIDO (NOVO)
========================= */
async function excluirPedido(id) {

    const confirmar = confirm("Deseja realmente excluir este pedido?");

    if (!confirmar) return;

    const token = getToken();

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            carregarPedidos(); // atualiza lista
        } else {
            alert("Erro ao excluir pedido.");
        }

    } catch (error) {
        console.error(error);
        alert("Erro ao excluir pedido.");
    }
}

/* =========================
   BUSCA
========================= */
buscarPedido.addEventListener("input", () => {

    const valor = buscarPedido.value.toLowerCase();

    const filtrados = pedidos.filter((pedido) => {

        return (
            pedido.clienteNome.toLowerCase().includes(valor) ||
            pedido.id.toString().includes(valor) ||
            pedido.status.toLowerCase().includes(valor)
        );
    });

    renderizarPedidos(filtrados);
});

/* =========================
   INICIAR
========================= */
carregarPedidos();