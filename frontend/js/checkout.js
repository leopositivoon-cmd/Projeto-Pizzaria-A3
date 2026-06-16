/* =========================
   CARRINHO
========================== */
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
const resumoPedido = document.getElementById('resumoPedido');
const totalCheckout = document.getElementById('totalCheckout');
let totalFinal = 0;

/* =========================
   RENDERIZAR RESUMO
========================== */
carrinho.forEach((item) => {
    const valorNumerico = Number(item.valor.replace('R$ ', '').replace(',', '.'));
    totalFinal += valorNumerico;

    resumoPedido.innerHTML += `
        <div class="item-checkout">
            <h3>${item.pizza}</h3>
            <p><strong>Sabores:</strong> ${item.sabores.join(', ')}</p>
            <p><strong>Borda:</strong> ${item.borda}</p>
            <p><strong>Bebida:</strong> ${item.bebida}</p>
            <p><strong>Observação:</strong> ${item.observacao || 'Nenhuma'}</p>
            <span>${item.valor}</span>
        </div>
    `;
});

totalCheckout.innerHTML = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;

/* =========================
   FINALIZAR PEDIDO
========================== */
async function finalizarPedido() {
    const nome = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const endereco = document.getElementById('enderecoCliente').value;
    const bairro = document.getElementById('bairroCliente').value;
    const referencia = document.getElementById('referenciaCliente').value;
    const pagamento = document.getElementById('formaPagamento').value;

    /* VALIDAÇÃO */
    if (nome === '' || telefone === '' || endereco === '' || pagamento === '') {
        alert('Preencha os dados obrigatórios.');
        return;
    }

    /* MONTAR ITENS PARA O BACKEND */
    const itensFormatados = carrinho.map(item => ({
        pizza: item.pizza,
        sabores: item.sabores,
        borda: item.borda,
        bebida: item.bebida,
        observacao: item.observacao,
        valor: Number(item.valor.replace('R$ ', '').replace(',', '.'))
    }));

    /* OBJETO FINAL */
    const pedidoFinal = {
        clienteNome: nome,
        cliente: {
            nome: nome,
            telefone: telefone,
            endereco: endereco,
            bairro: bairro,
            referencia: referencia
        },
        pagamento: pagamento,
        itens: itensFormatados
        // total: totalFinal // Removido: o backend calcula
    };

    try {
        /* ENVIAR PARA BACKEND */
        const response = await fetch("http://localhost:8080/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedidoFinal)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar pedido no backend');
        }

        const pedidoSalvo = await response.json();
        const totalCalculado = pedidoSalvo.total;

        /* MONTAR RESUMO WHATSAPP */
        let resumo = "";
        carrinho.forEach(item => {
            resumo += ` ${item.pizza}\nSabores: ${item.sabores.join(', ')}\nBorda: ${item.borda}\nBebida: ${item.bebida}\nObs: ${item.observacao || 'Nenhuma'}\n----------------------\n\n`;
        });

        /* MONTAR MENSAGEM WHATSAPP */
        const mensagem = ` *NOVO PEDIDO - PIZZARIA*
 Nome: ${nome}
 Telefone: ${telefone}
 Endereço: ${endereco}
 Bairro: ${bairro}
 Referência: ${referencia}
 Pagamento: ${pagamento}
 PEDIDO:
${resumo}
💰 TOTAL: R$ ${totalCalculado.toFixed(2).replace('.', ',')}`;

        const numeroWhatsApp = "5548992111402";
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(url, '_blank');
        alert("Pedido enviado com sucesso!");
        
        // Limpar carrinho após sucesso
        localStorage.removeItem('carrinho');
        window.location.href = 'index.html';

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar pedido para o servidor.");
    }
}
