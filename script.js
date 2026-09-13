// ============================================
// TEMPLATE "INTERATIVO" — script.js
// ============================================
// Este template simula: catálogo de serviços, calculadora de
// orçamento em tempo real, marcação de horário e um formulário
// final que junta tudo e envia o pedido.
//
// Para ligar o envio de emails a sério, cria uma conta grátis em
// https://formspree.io, cria um formulário e troca o valor de
// FORMSPREE_URL aqui em baixo pelo endpoint que eles te derem.
// Enquanto não trocares, o formulário usa "mailto" como alternativa
// (abre o email do visitante já preenchido).
// ============================================

const FORMSPREE_URL = 'https://formspree.io/f/XXXXXXXX'; // <- troca aqui
const EMAIL_NEGOCIO = 'geral@nomedonegocio.pt'; // <- troca aqui (usado no fallback mailto)

// ------------------------------------------------
// Ícones (SVG reutilizáveis, sem emojis)
// ------------------------------------------------
const ICONES_SERVICO = {
    consultoria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    instalacao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    manutencao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
};

// ------------------------------------------------
// Catálogo de serviços — dados de exemplo
// ------------------------------------------------
const catalogoServicos = [
    {
        id: 1, categoria: 'Consultoria', nome: 'Consultoria Inicial',
        preco: 50, icone: 'consultoria',
        descricao: 'Sessão de diagnóstico para perceber a necessidade do cliente e propor o melhor caminho.'
    },
    {
        id: 2, categoria: 'Consultoria', nome: 'Consultoria Avançada',
        preco: 90, icone: 'consultoria',
        descricao: 'Análise mais aprofundada, com relatório escrito e recomendações detalhadas.'
    },
    {
        id: 3, categoria: 'Instalação', nome: 'Instalação Standard',
        preco: 120, icone: 'instalacao',
        descricao: 'Instalação completa do serviço/equipamento, com testes finais incluídos.'
    },
    {
        id: 4, categoria: 'Instalação', nome: 'Instalação Premium',
        preco: 200, icone: 'instalacao',
        descricao: 'Instalação prioritária com configuração avançada e acompanhamento extra.'
    },
    {
        id: 5, categoria: 'Manutenção', nome: 'Manutenção Simples',
        preco: 40, icone: 'manutencao',
        descricao: 'Revisão rápida para garantir que está tudo a funcionar corretamente.'
    },
    {
        id: 6, categoria: 'Manutenção', nome: 'Manutenção Completa',
        preco: 75, icone: 'manutencao',
        descricao: 'Revisão completa com substituição de peças de desgaste, se necessário.'
    }
];

const categorias = ['Todos', ...new Set(catalogoServicos.map(s => s.categoria))];

// ------------------------------------------------
// Estado
// ------------------------------------------------
const estado = {
    servicosSelecionados: new Set(),
    categoriaAtiva: 'Todos',
    dataEscolhida: null,
    horaEscolhida: null
};

// ------------------------------------------------
// Ano automático + menu mobile
// ------------------------------------------------
document.getElementById('anoAtual').textContent = new Date().getFullYear();

const btnMenu = document.getElementById('btnMenu');
const navPrincipal = document.getElementById('navPrincipal');
btnMenu.addEventListener('click', () => {
    const aberto = navPrincipal.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
});
navPrincipal.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navPrincipal.classList.remove('aberto'));
});

// ------------------------------------------------
// Filtros de categoria
// ------------------------------------------------
const filtrosContainer = document.getElementById('filtrosCategoria');

function renderFiltros() {
    filtrosContainer.innerHTML = categorias.map(cat => `
        <button class="filtro-btn ${cat === estado.categoriaAtiva ? 'ativo' : ''}" data-categoria="${cat}">
            ${cat}
        </button>
    `).join('');

    filtrosContainer.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            estado.categoriaAtiva = btn.dataset.categoria;
            renderFiltros();
            renderCatalogo();
        });
    });
}

// ------------------------------------------------
// Catálogo
// ------------------------------------------------
const catalogoGrid = document.getElementById('catalogoGrid');

function renderCatalogo() {
    const servicosVisiveis = catalogoServicos.filter(s =>
        estado.categoriaAtiva === 'Todos' || s.categoria === estado.categoriaAtiva
    );

    catalogoGrid.innerHTML = servicosVisiveis.map(s => `
        <div class="servico-cartao ${estado.servicosSelecionados.has(s.id) ? 'selecionado' : ''}" data-id="${s.id}">
            <div class="servico-icone">${ICONES_SERVICO[s.icone] || ''}</div>
            <p class="servico-categoria">${s.categoria}</p>
            <h3>${s.nome}</h3>
            <p class="servico-desc">${s.descricao}</p>
            <p class="servico-preco">${s.preco} €</p>
            <label class="servico-checkbox">
                <input type="checkbox" data-id="${s.id}" ${estado.servicosSelecionados.has(s.id) ? 'checked' : ''}>
                Adicionar ao orçamento
            </label>
        </div>
    `).join('');

    catalogoGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = Number(e.target.dataset.id);
            if (e.target.checked) {
                estado.servicosSelecionados.add(id);
            } else {
                estado.servicosSelecionados.delete(id);
            }
            renderCatalogo();
            renderOrcamento();
            renderResumoFinal();
        });
    });
}

// ------------------------------------------------
// Orçamento (calculadora)
// ------------------------------------------------
const listaOrcamento = document.getElementById('listaOrcamento');
const orcamentoTotal = document.getElementById('orcamentoTotal');

function renderOrcamento() {
    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));

    if (selecionados.length === 0) {
        listaOrcamento.innerHTML = '<li class="orcamento-vazio">Ainda não selecionou nenhum serviço.</li>';
        orcamentoTotal.textContent = '0 €';
        return;
    }

    listaOrcamento.innerHTML = selecionados.map(s => `
        <li><span>${s.nome}</span><span class="item-preco">${s.preco} €</span></li>
    `).join('');

    const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
    orcamentoTotal.textContent = `${total} €`;
}

// ------------------------------------------------
// Marcações (data + horário)
// ------------------------------------------------
const dataMarcacao = document.getElementById('dataMarcacao');
const blocoHorarios = document.getElementById('blocoHorarios');
const horariosGrid = document.getElementById('horariosGrid');
const marcacaoResumo = document.getElementById('marcacaoResumo');

const hoje = new Date().toISOString().split('T')[0];
dataMarcacao.min = hoje;

const HORAS_DISPONIVEIS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

// gera disponibilidade "simulada" mas sempre igual para a mesma data
// (não é um sistema real de reservas — é só para mostrar a interação)
function horasIndisponiveisParaData(dataStr) {
    let soma = 0;
    for (const ch of dataStr) soma += ch.charCodeAt(0);
    const indisponiveis = new Set();
    indisponiveis.add(soma % HORAS_DISPONIVEIS.length);
    indisponiveis.add((soma * 3 + 1) % HORAS_DISPONIVEIS.length);
    return indisponiveis;
}

dataMarcacao.addEventListener('change', () => {
    estado.dataEscolhida = dataMarcacao.value;
    estado.horaEscolhida = null;

    if (!estado.dataEscolhida) {
        blocoHorarios.hidden = true;
        return;
    }

    const indisponiveis = horasIndisponiveisParaData(estado.dataEscolhida);

    horariosGrid.innerHTML = HORAS_DISPONIVEIS.map((h, i) => `
        <button type="button" class="horario-btn" data-hora="${h}" ${indisponiveis.has(i) ? 'disabled' : ''}>
            ${h}
        </button>
    `).join('');

    horariosGrid.querySelectorAll('.horario-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            horariosGrid.querySelectorAll('.horario-btn').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            estado.horaEscolhida = btn.dataset.hora;
            atualizarResumoMarcacao();
            renderResumoFinal();
        });
    });

    blocoHorarios.hidden = false;
    atualizarResumoMarcacao();
    renderResumoFinal();
});

function formatarDataPt(dataStr) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
}

function atualizarResumoMarcacao() {
    if (!estado.dataEscolhida) {
        marcacaoResumo.textContent = '';
        return;
    }
    marcacaoResumo.textContent = estado.horaEscolhida
        ? `Marcação selecionada: ${formatarDataPt(estado.dataEscolhida)} às ${estado.horaEscolhida}`
        : `Escolha um horário disponível para ${formatarDataPt(estado.dataEscolhida)}.`;
}

// ------------------------------------------------
// Resumo final (dentro do formulário de contacto)
// ------------------------------------------------
const resumoServicos = document.getElementById('resumoServicos');
const resumoHorario = document.getElementById('resumoHorario');

function renderResumoFinal() {
    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));

    if (selecionados.length === 0) {
        resumoServicos.textContent = 'Nenhum serviço selecionado ainda.';
    } else {
        const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
        resumoServicos.textContent = `Serviços: ${selecionados.map(s => s.nome).join(', ')} — Total: ${total} €`;
    }

    resumoHorario.textContent = (estado.dataEscolhida && estado.horaEscolhida)
        ? `Horário: ${formatarDataPt(estado.dataEscolhida)} às ${estado.horaEscolhida}`
        : 'Nenhum horário selecionado ainda.';
}

// ------------------------------------------------
// Envio do formulário
// ------------------------------------------------
const formContacto = document.getElementById('formContacto');
const formNota = document.getElementById('formNota');
const btnEnviar = document.getElementById('btnEnviar');

formContacto.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));
    const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
    const resumoServicosTexto = selecionados.length
        ? selecionados.map(s => `${s.nome} (${s.preco} €)`).join(', ')
        : 'Nenhum';
    const resumoHorarioTexto = (estado.dataEscolhida && estado.horaEscolhida)
        ? `${formatarDataPt(estado.dataEscolhida)} às ${estado.horaEscolhida}`
        : 'Não selecionado';

    const corpoCompleto =
        `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone || '-'}\n\n` +
        `Serviços pedidos: ${resumoServicosTexto}\nTotal estimado: ${total} €\n` +
        `Horário pretendido: ${resumoHorarioTexto}\n\nMensagem:\n${mensagem || '-'}`;

    // Enquanto o Formspree não estiver configurado, usa mailto como alternativa
    if (FORMSPREE_URL.includes('XXXXXXXX')) {
        const assunto = encodeURIComponent(`Novo pedido de orçamento de ${nome}`);
        window.location.href = `mailto:${EMAIL_NEGOCIO}?subject=${assunto}&body=${encodeURIComponent(corpoCompleto)}`;
        formNota.textContent = 'A abrir o teu email para enviares o pedido... (liga o Formspree para enviar sem sair da página)';
        formNota.className = 'form-nota';
        return;
    }

    btnEnviar.disabled = true;
    formNota.textContent = 'A enviar...';
    formNota.className = 'form-nota';

    try {
        const dadosFormulario = new FormData();
        dadosFormulario.append('nome', nome);
        dadosFormulario.append('email', email);
        dadosFormulario.append('telefone', telefone);
        dadosFormulario.append('mensagem', corpoCompleto);

        const resposta = await fetch(FORMSPREE_URL, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: dadosFormulario
        });

        if (resposta.ok) {
            formNota.textContent = 'Pedido enviado com sucesso! Entraremos em contacto em breve.';
            formNota.className = 'form-nota sucesso';
            formContacto.reset();
            estado.servicosSelecionados.clear();
            estado.dataEscolhida = null;
            estado.horaEscolhida = null;
            blocoHorarios.hidden = true;
            renderCatalogo();
            renderOrcamento();
            renderResumoFinal();
        } else {
            throw new Error('Falha no envio');
        }
    } catch (erro) {
        formNota.textContent = 'Não foi possível enviar agora. Tenta novamente ou contacta-nos diretamente.';
        formNota.className = 'form-nota erro';
    } finally {
        btnEnviar.disabled = false;
    }
});

// ------------------------------------------------
// Arranque
// ------------------------------------------------
renderFiltros();
renderCatalogo();
renderOrcamento();
renderResumoFinal();
