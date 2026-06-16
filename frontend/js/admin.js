/* =========================
   URL BACKEND
========================== */
const API_URL = "http://localhost:8080/pedidos";

/* =========================
   ELEMENTOS
========================== */
const listaPedidos = document.getElementById('listaPedidos');
const totalPedidos = document.getElementById('totalPedidos');
const faturamentoTotal = document.getElementById('faturamentoTotal');
const pedidosPreparo = document.getElementById('pedidosPreparo');
const clientesAtivos = document.getElementById('clientesAtivos');

const pesquisaPedido = document.getElementById('pesquisaPedido');
const filtroStatus = document.getElementById('filtroStatus');

// Elementos do Modal de Análise
const ticketMedioModal = document.getElementById('ticketMedioModal');
const novosClientesModal = document.getElementById('novosClientesModal');
const rankingClientesModal = document.getElementById('rankingClientesModal');

let graficoStatusModal = null;
let graficoFatClienteModal = null;

/* =========================
   DADOS
========================== */
let todosPedidos = [];

/* =========================
   LOGIN & TOKEN
========================== */
function realizarLogin() { window.location.href = 'login.html'; }
function getToken() { return localStorage.getItem('token'); }

/* =========================
   CARREGAR PEDIDOS
========================== */
async function carregarPedidos() {
    const token = getToken();
    if (!token) { realizarLogin(); return; }

    try {
        const response = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada.");
            localStorage.removeItem('token');
            realizarLogin();
            return;
        }

        todosPedidos = await response.json();
        renderizarPedidos(todosPedidos);
    } catch (error) {
        console.error(error);
        listaPedidos.innerHTML = `<tr><td colspan="4" class="text-center">Erro ao carregar dados.</td></tr>`;
    }
}

/* =========================
   RENDERIZAR PEDIDOS
========================== */
function renderizarPedidos(pedidos) {
    listaPedidos.innerHTML = '';
    if (!pedidos || pedidos.length === 0) {
        listaPedidos.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum pedido encontrado.</td></tr>`;
        atualizarCardsResumo([]);
        return;
    }

    pedidos.forEach(pedido => {
        listaPedidos.innerHTML += `
            <tr>
                <td>#${pedido.id}</td>
                <td>${pedido.clienteNome}</td>
                <td><span class="badge ${getStatusBadgeClass(pedido.status)}">${pedido.status}</span></td>
                <td>R$ ${pedido.total.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
    });
    atualizarCardsResumo(pedidos);
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'EM_PREPARO': return 'bg-warning text-dark';
        case 'PRONTO': return 'bg-info text-dark';
        case 'ENTREGUE': return 'bg-success';
        default: return 'bg-secondary';
    }
}

/* =========================
   ATUALIZAR CARDS RESUMO
========================== */
function atualizarCardsResumo(pedidos) {
    const faturamento = pedidos.reduce((acc, p) => acc + p.total, 0);
    const emPreparo = pedidos.filter(p => p.status === 'EM_PREPARO').length;
    const clientesUnicos = new Set(pedidos.map(p => p.clienteNome)).size;

    if (totalPedidos) totalPedidos.textContent = pedidos.length;
    if (faturamentoTotal) faturamentoTotal.textContent = `R$ ${faturamento.toFixed(2).replace('.', ',')}`;
    if (pedidosPreparo) pedidosPreparo.textContent = emPreparo;
    if (clientesAtivos) clientesAtivos.textContent = clientesUnicos;
}

/* =========================
   DASHBOARD DE ANÁLISE (MODAL)
========================== */
function abrirDashboardAnalise() {
    // Abrir o modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('modalDashboardAnalise'));
    modal.show();

    // Processar dados para a análise
    const totalPedidosQtd = todosPedidos.length;
    const faturamentoTotalVal = todosPedidos.reduce((acc, p) => acc + p.total, 0);
    const tMedio = totalPedidosQtd > 0 ? faturamentoTotalVal / totalPedidosQtd : 0;
    const clientesUnicos = new Set(todosPedidos.map(p => p.clienteNome));

    // Atualizar métricas no modal
    if (ticketMedioModal) ticketMedioModal.textContent = `R$ ${tMedio.toFixed(2).replace('.', ',')}`;
    if (novosClientesModal) novosClientesModal.textContent = clientesUnicos.size;

    // Gerar Ranking e Gráficos
    gerarRankingModal();
    gerarGraficosModal();
}

function gerarRankingModal() {
    if (!rankingClientesModal) return;

    const ranking = {};
    todosPedidos.forEach(p => {
        ranking[p.clienteNome] = (ranking[p.clienteNome] || 0) + 1;
    });

    const ordenado = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
    rankingClientesModal.innerHTML = ordenado.map((c, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${c[0]}</td>
            <td>${c[1]} pedidos</td>
        </tr>
    `).join('');
}

function gerarGraficosModal() {
    // Gráfico de Status
    const statusData = { EM_PREPARO: 0, PRONTO: 0, ENTREGUE: 0 };
    const fatPorCliente = {};

    todosPedidos.forEach(p => {
        if (statusData[p.status] !== undefined) statusData[p.status]++;
        fatPorCliente[p.clienteNome] = (fatPorCliente[p.clienteNome] || 0) + p.total;
    });

    const ctxStatus = document.getElementById('graficoStatusModal');
    if (ctxStatus) {
        if (graficoStatusModal) graficoStatusModal.destroy();
        graficoStatusModal = new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Preparo', 'Pronto', 'Entregue'],
                datasets: [{
                    data: [statusData.EM_PREPARO, statusData.PRONTO, statusData.ENTREGUE],
                    backgroundColor: ['#f39c12', '#3498db', '#2ecc71']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Gráfico de Faturamento por Cliente
    const ctxFat = document.getElementById('graficoFatClienteModal');
    if (ctxFat) {
        if (graficoFatClienteModal) graficoFatClienteModal.destroy();
        const top5 = Object.entries(fatPorCliente).sort((a, b) => b[1] - a[1]).slice(0, 5);

        graficoFatClienteModal = new Chart(ctxFat, {
            type: 'bar',
            data: {
                labels: top5.map(c => c[0]),
                datasets: [{
                    label: 'Gasto Total (R$)',
                    data: top5.map(c => c[1]),
                    backgroundColor: '#d62828'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y' // Gráfico horizontal
            }
        });
    }
}

/* =========================
   FILTRAGEM E EXPORTAÇÃO
========================== */
function filtrarPedidos() {
    const texto = pesquisaPedido.value.toLowerCase();
    const status = filtroStatus.value;
    const filtrados = todosPedidos.filter(p => 
        (p.clienteNome.toLowerCase().includes(texto) || p.id.toString().includes(texto)) &&
        (status === '' || p.status === status)
    );
    renderizarPedidos(filtrados);
}

function exportarCSV() {
    let csv = "ID,Cliente,Status,Total\n";
    todosPedidos.forEach(p => csv += `${p.id},${p.clienteNome},${p.status},${p.total}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio.csv';
    link.click();
}

/* =========================
   EXPORTAR PDF
========================== */
function exportarPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Pedidos - Pizzaria Vitoriana", 14, 20);

    // Data
    doc.setFontSize(10);
    doc.text(
        `Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
        14,
        28
    );

    // Resumo
    const faturamento = todosPedidos.reduce((acc, p) => acc + p.total, 0);
    const emPreparo = todosPedidos.filter(p => p.status === 'EM_PREPARO').length;
    const clientesUnicos = new Set(todosPedidos.map(p => p.clienteNome)).size;

    doc.setFontSize(12);
    doc.text(`Total de Pedidos: ${todosPedidos.length}`, 14, 40);
    doc.text(`Faturamento Total: R$ ${faturamento.toFixed(2)}`, 14, 48);
    doc.text(`Pedidos em Preparo: ${emPreparo}`, 14, 56);
    doc.text(`Clientes Ativos: ${clientesUnicos}`, 14, 64);

    // Cabeçalho da tabela
    let y = 80;

    doc.setFillColor(214, 40, 40);
    doc.rect(14, y - 6, 180, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.text("ID", 18, y);
    doc.text("Cliente", 40, y);
    doc.text("Status", 110, y);
    doc.text("Total", 160, y);

    doc.setTextColor(0, 0, 0);

    y += 10;

    // Dados
    todosPedidos.forEach((pedido) => {

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

        doc.text(`#${pedido.id}`, 18, y);
        doc.text(pedido.clienteNome.substring(0, 30), 40, y);
        doc.text(pedido.status, 110, y);
        doc.text(
            `R$ ${pedido.total.toFixed(2).replace('.', ',')}`,
            160,
            y
        );

        y += 8;
    });

    doc.save("relatorio-pedidos.pdf");
}

/* =========================
   EVENTOS
========================== */
if (pesquisaPedido) pesquisaPedido.addEventListener('input', filtrarPedidos);
if (filtroStatus) filtroStatus.addEventListener('change', filtrarPedidos);
if (document.getElementById('btnExportarCSV')) document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
if (document.getElementById('btnExportarPDF')) {
    document.getElementById('btnExportarPDF')
        .addEventListener('click', exportarPDF);
}

document.querySelectorAll('.card-admin span').forEach(span => {
    const valor = parseInt(span.textContent.replace(/\D/g, ''));

    if (valor >= 1000) {
        span.style.fontSize = '2rem';
        span.style.whiteSpace = 'normal';
    } else if (valor >= 100) {
        span.style.fontSize = '2.5rem';
        span.style.whiteSpace = 'nowrap';
    } else {
        span.style.fontSize = '3rem';
        span.style.whiteSpace = 'nowrap';
    }
});

// Iniciar
carregarPedidos();