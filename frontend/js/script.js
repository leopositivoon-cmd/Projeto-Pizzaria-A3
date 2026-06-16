const API_PRODUTOS = "http://localhost:8082/produtos";


/* =========================
   MENU MOBILE
========================== */

function toggleMenu(){

    const nav =
        document.querySelector('nav');

    const icon =
        document.querySelector('.menu-mobile i');

    nav.classList.toggle('ativo');

    if(nav.classList.contains('ativo')){

        icon.classList.remove('bi-list');

        icon.classList.add('bi-x-lg');

    }

    else{

        icon.classList.remove('bi-x-lg');

        icon.classList.add('bi-list');

    }

}
    
    /* =========================
       SLIDER
    ========================== */

    const slides =
        document.querySelector('.slides');

    const slide =
        document.querySelectorAll('.slide');

    const next =
        document.getElementById('next');

    const prev =
        document.getElementById('prev');

    let index = 0;

    /* PRÓXIMO */

    next.addEventListener('click', () => {

        index++;

        if(index >= slide.length){

            index = 0;

        }

        updateSlider();

    });

    /* VOLTAR */

    prev.addEventListener('click', () => {

        index--;

        if(index < 0){

            index = slide.length - 1;

        }

        updateSlider();

    });

    /* UPDATE */

    function updateSlider(){

        slides.style.transform =
        `translateX(-${index * 100}vw)`;

    }

    /* AUTO SLIDE */

    setInterval(() => {

        index++;

        if(index >= slide.length){

            index = 0;

        }

        updateSlider();

    }, 5000);

    /* =========================
       MODAL
    ========================== */

    const modal =
        document.getElementById('modalPizza');

    let valorBase = 95;

    function abrirModal(tipo, preco){

        modal.style.display = 'flex';

        valorBase = preco;

        const titulo =
            document.getElementById('tituloPizza');

        const descricao =
            document.getElementById('descricaoPizza');

        /* MÉDIA */

        if(tipo === 'media'){

            titulo.innerHTML =
                'Pizza Média 6 Fatias + Bebida';

            descricao.innerHTML =
                'Cada sabor corresponde a 3 fatias.';

        }

        /* GRANDE */

        else if(tipo === 'grande'){

            titulo.innerHTML =
                'Pizza Grande 8/9 Fatias + Bebida';

            descricao.innerHTML =
                '1 sabor inteira, 2 sabores meio a meio ou 3 sabores divididos igualmente.';

        }

        /* GIGANTE */

        else{

            titulo.innerHTML =
                'Pizza Gigante 12 Fatias + Bebida';

            descricao.innerHTML =
                'Cada sabor escolhido corresponde a 3 fatias.';

        }

        calcularTotal();

    }

    function fecharModal(){

        modal.style.display = 'none';

    }

    async function carregarProdutosExtras() {

    try {

        const response =
            await fetch(API_PRODUTOS);

        const produtos =
            await response.json();

        console.log("Produtos carregados:", produtos);

        carregarSaboresExtras(produtos);
        carregarBordasExtras(produtos);
        carregarBebidasExtras(produtos);

    } catch(error) {

        console.error(
            "Erro ao carregar produtos extras:",
            error
        );

    }

}

function carregarSaboresExtras(produtos) {

    const container =
        document.getElementById("saboresDinamicos");

    if (!container) return;

    container.innerHTML = "";

    const saboresFixos = [

        "Calabresa",
        "Frango com Catupiry",
        "Bacon Especial",
        "Camarão",
        "Portuguesa",
        "4 Queijos"

    ];

    produtos
        .filter(p => p.tipo === "PIZZA")
        .filter(p => !saboresFixos.includes(p.nome))
        .forEach(p => {

            container.innerHTML += `
                <label>
                    <input
                        type="checkbox"
                        class="sabor"
                        value="${p.preco}">
                    ${p.nome}
                </label>
            `;

        });

    // Registrar eventos para os novos sabores dinâmicos
    document
        .querySelectorAll('.sabor')
        .forEach(item => {

            item.addEventListener(
                'change',
                calcularTotal
            );

        });

}

function carregarBordasExtras(produtos) {

    const container =
        document.getElementById("bordasDinamicas");

    if (!container) return;

    container.innerHTML = "";

    produtos
        .filter(p => p.tipo === "BORDA")
        .forEach(p => {

            container.innerHTML += `
                <label>
                    <input
                        type="radio"
                        name="borda"
                        value="${p.preco}">
                    ${p.nome}
                    (+R$${p.preco})
                </label>
            `;

        });

    // Registrar eventos para as novas bordas dinâmicas
    document
        .querySelectorAll('input[name="borda"]')
        .forEach(item => {

            item.addEventListener(
                'change',
                calcularTotal
            );

        });

}

function carregarBebidasExtras(produtos) {

    const select =
        document.getElementById("bebida");

    if (!select) return;

    const bebidasFixas = [

        "Coca-Cola 2L",
        "Del Valle",
        "Guaraná 2L"

    ];

    produtos
        .filter(p => p.tipo === "BEBIDA")
        .filter(p => !bebidasFixas.includes(p.nome))
        .forEach(p => {

            select.innerHTML += `
                <option value="${p.preco}">
                    ${p.nome}
                    (+R$${p.preco})
                </option>
            `;

        });

}

    /* =========================
       CALCULAR TOTAL
    ========================== */

    const sabores =
        document.querySelectorAll('.sabor');

    const bordas =
        document.querySelectorAll('input[name="borda"]');

    const bebida =
        document.getElementById('bebida');

    /* EVENTOS INICIAIS (para elementos estáticos) */

    sabores.forEach(item => {

        item.addEventListener('change', calcularTotal);

    });

    bordas.forEach(item => {

        item.addEventListener('change', calcularTotal);

    });

    bebida.addEventListener('change', calcularTotal);

    /* TOTAL */

    function calcularTotal(){

        let total = valorBase;

        /* BORDA */

        const bordaSelecionada =
            document.querySelector('input[name="borda"]:checked');

        if (bordaSelecionada) {
            total += Number(bordaSelecionada.value);
        }

        /* BEBIDA */

        if (bebida) {
            total += Number(bebida.value);
        }

        document.getElementById('valorTotal')
            .innerHTML =
            `R$ ${total.toFixed(2).replace('.', ',')}`;

    }

    /* =========================
       CARRINHO
    ========================== */

    let carrinho = [];

    /* ABRIR */

    function abrirCarrinho(){

        document
            .getElementById('carrinho')
            .classList.add('ativo');

    }

    /* FECHAR */

    function fecharCarrinho(){

        document
            .getElementById('carrinho')
            .classList.remove('ativo');

    }

    /* =========================
       ADICIONAR AO CARRINHO
    ========================== */

    function adicionarAoCarrinho(){

        const titulo =
            document.getElementById('tituloPizza').innerText;

        const total =
            document.getElementById('valorTotal').innerText;

        const observacao =
            document.getElementById('observacao').value;

        /* SABORES */

        const saboresSelecionados =
            document.querySelectorAll('.sabor:checked');

        let saboresPedido = [];

        saboresSelecionados.forEach(item => {

            saboresPedido.push(
                item.parentElement.innerText.trim()
            );

        });

        /* BORDA */

        const bordaElemento = document.querySelector('input[name="borda"]:checked');
        const borda = bordaElemento 
            ? bordaElemento.parentElement.innerText.trim()
            : "Nenhuma";

        /* BEBIDA */

        const bebidaSelecionada =
            bebida.options[bebida.selectedIndex].text;

        /* OBJETO */

        const pedido = {

            pizza: titulo,

            sabores: saboresPedido,

            borda: borda,

            bebida: bebidaSelecionada,

            observacao: observacao,

            valor: total

        };

        /* SALVAR */

        carrinho.push(pedido);

        atualizarCarrinho();

        fecharModal();

        abrirCarrinho();

    }

    /* =========================
       ATUALIZAR CARRINHO
    ========================== */

    function atualizarCarrinho(){

        const itens =
            document.getElementById('itensCarrinho');

        if (!itens) return;

        itens.innerHTML = '';

        let totalFinal = 0;

        carrinho.forEach((item, index) => {

            totalFinal +=
                Number(
                    item.valor
                    .replace('R$ ', '')
                    .replace(',', '.')
                );

            itens.innerHTML += `

            <div class="item-carrinho">
                <h3>
                    ${item.pizza}
                </h3>

                <p>
                    <strong>Sabores:</strong>
                    ${item.sabores.join(', ')}
                </p>

                <p>
                    <strong>Borda:</strong>
                    ${item.borda}
                </p>

                <p>
                    <strong>Bebida:</strong>
                    ${item.bebida}
                </p>

                <p>
                    <strong>Obs:</strong>
                    ${item.observacao || 'Nenhuma'}
                </p>

                <span>
                    ${item.valor}
                </span>

                <button onclick="removerPedido(${index})">
                    <i class="bi bi-x-circle-fill"></i> Cancelar Pedido
                </button>
            </div>

            `;

        });

        const totalCarrinhoElem = document.getElementById('totalCarrinho');
        if (totalCarrinhoElem) {
            totalCarrinhoElem.innerHTML = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
        }

    }

    /* =========================
       REMOVER PEDIDO
    ========================== */

    function removerPedido(index){

        carrinho.splice(index, 1);

        atualizarCarrinho();

    }

    function irParaCheckout(){

    localStorage.setItem(
        'carrinho',
        JSON.stringify(carrinho)
    );

    window.location.href =
        '../pages/checkout.html';

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarProdutosExtras();

    }
);