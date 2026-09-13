// ============================================
// TEMPLATE "INTERATIVO" — Academia de Basquetebol
// ============================================
// Catálogo de programas, simulador de mensalidade em tempo
// real, marcação de aula experimental, e um formulário final
// que junta tudo e envia a inscrição.
//
// Para ligar o envio de emails a sério, cria uma conta grátis em
// https://formspree.io, cria um formulário e troca o valor de
// FORMSPREE_URL aqui em baixo pelo endpoint que eles te derem.
// Enquanto não trocares, o formulário usa "mailto" como alternativa
// (abre o email do visitante já preenchido).
// ============================================

const FORMSPREE_URL = 'https://formspree.io/f/XXXXXXXX'; // <- troca aqui
const EMAIL_NEGOCIO = 'geral@aroalto.pt'; // <- troca aqui (usado no fallback mailto)

// ------------------------------------------------
// Ícones (SVG reutilizáveis, sem emojis)
// ------------------------------------------------
const ICONES_SERVICO = {
    bola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2v20M4.5 4.5c3 3 3 12 0 15M19.5 4.5c-3 3-3 12 0 15"/></svg>',
    apito: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h8a4 4 0 0 1 0 8h-2l-2 3-2-3H8a4 4 0 0 1 0-8z"/><circle cx="16" cy="12" r="1.3"/></svg>',
    camisola: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4 4 7l2 3 2-1v11h8V9l2 1 2-3-4-3-2 2h-2z"/></svg>',
    cronometro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>'
};

// ------------------------------------------------
// Catálogo de programas — dados de exemplo
// ------------------------------------------------
const catalogoServicos = [
    {
        id: 1, categoria: 'Formação Jovem', nome: 'Mini-Basket (6-9 anos)',
        preco: 30, icone: 'bola',
        descricao: 'Iniciação lúdica ao basquetebol — coordenação, regras básicas e muita diversão.'
    },
    {
        id: 2, categoria: 'Formação Jovem', nome: 'Sub-12 (10-12 anos)',
        preco: 35, icone: 'apito',
        descricao: 'Fundamentos técnicos e táticos, com primeiros jogos e torneios de formação.'
    },
    {
        id: 3, categoria: 'Formação Jovem', nome: 'Sub-16 (13-16 anos)',
        preco: 40, icone: 'camisola',
        descricao: 'Treino de competição, preparação física e participação no campeonato distrital.'
    },
    {
        id: 4, categoria: 'Adultos', nome: 'Sénior / Adultos',
        preco: 35, icone: 'bola',
        descricao: 'Treino livre para adultos de todos os níveis — condição física e jogo em equipa.'
    },
    {
        id: 5, categoria: 'Adultos', nome: 'Veteranos 35+',
        preco: 30, icone: 'apito',
        descricao: 'Ritmo adaptado, foco em bem-estar, técnica e convívio dentro de campo.'
    },
    {
        id: 6, categoria: 'Individual', nome: 'Treino Personalizado 1-a-1',
        preco: 60, icone: 'cronometro',
        descricao: 'Sessão individual com treinador dedicado — plano de progressão à medida.'
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
    horaEscolhida: null,
    inscricaoEnviada: false
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
// Animação de entrada ao scroll (dá vida à página)
// ------------------------------------------------
const observadorRevelacao = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observadorRevelacao.unobserve(entrada.target);
        }
    });
}, { threshold: 0.12 });

function ativarRevelacao(elementos) {
    elementos.forEach(el => {
        el.classList.add('reveal');
        observadorRevelacao.observe(el);
    });
}

// ------------------------------------------------
// Indicador de progresso (stepper)
// ------------------------------------------------
const stepEls = document.querySelectorAll('.step');
const linhaEls = document.querySelectorAll('.step-linha');

function atualizarStepper() {
    const passo1 = estado.servicosSelecionados.size > 0; // Programas escolhidos
    const passo2 = passo1; // Mensalidade calculada automaticamente junto com o passo 1
    const passo3 = Boolean(estado.dataEscolhida && estado.horaEscolhida); // Aula marcada
    const passo4 = estado.inscricaoEnviada; // Inscrição enviada

    const concluidos = [passo1, passo2, passo3, passo4];
    const atual = concluidos.findIndex(c => !c); // primeiro passo por concluir

    stepEls.forEach((el, i) => {
        el.classList.toggle('concluido', concluidos[i]);
        el.classList.toggle('atual', i === atual);
    });

    linhaEls.forEach((el, i) => {
        el.classList.toggle('concluida', concluidos[i]);
    });
}

// ------------------------------------------------
// Resumo flutuante (fica sempre visível assim que há seleção)
// ------------------------------------------------
const resumoFlutuante = document.getElementById('resumoFlutuante');
const resumoFlutuanteTexto = document.getElementById('resumoFlutuanteTexto');

function renderResumoFlutuante() {
    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));

    if (selecionados.length === 0) {
        resumoFlutuante.hidden = true;
        return;
    }

    const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
    const plural = selecionados.length === 1 ? 'programa' : 'programas';
    resumoFlutuanteTexto.textContent = `${selecionados.length} ${plural} · ${total} €/mês`;
    resumoFlutuante.hidden = false;

    resumoFlutuante.classList.remove('pulso');
    void resumoFlutuante.offsetWidth;
    resumoFlutuante.classList.add('pulso');
}

resumoFlutuante.addEventListener('click', () => {
    document.getElementById('orcamento').scrollIntoView({ behavior: 'smooth' });
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
            <p class="servico-preco">${s.preco} €/mês</p>
            <label class="servico-checkbox">
                <input type="checkbox" data-id="${s.id}" ${estado.servicosSelecionados.has(s.id) ? 'checked' : ''}>
                Adicionar à inscrição
            </label>
        </div>
    `).join('');

    function alternarSelecao(id) {
        if (estado.servicosSelecionados.has(id)) {
            estado.servicosSelecionados.delete(id);
        } else {
            estado.servicosSelecionados.add(id);
        }
        renderCatalogo();
        renderOrcamento();
        renderResumoFinal();
        renderResumoFlutuante();
        atualizarStepper();
    }

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
            renderResumoFlutuante();
            atualizarStepper();
        });
    });

    // clicar em qualquer ponto do cartão também seleciona (não só na checkbox)
    catalogoGrid.querySelectorAll('.servico-cartao').forEach(cartao => {
        cartao.addEventListener('click', (e) => {
            if (e.target.closest('.servico-checkbox')) return; // deixa a checkbox tratar do próprio clique
            alternarSelecao(Number(cartao.dataset.id));
        });
    });

    ativarRevelacao(catalogoGrid.querySelectorAll('.servico-cartao'));
}

// ------------------------------------------------
// Orçamento (simulador de mensalidade)
// ------------------------------------------------
const listaOrcamento = document.getElementById('listaOrcamento');
const orcamentoTotal = document.getElementById('orcamentoTotal');

function renderOrcamento() {
    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));

    if (selecionados.length === 0) {
        listaOrcamento.innerHTML = '<li class="orcamento-vazio">Ainda não escolheste nenhum programa.</li>';
        orcamentoTotal.textContent = '0 €';
        return;
    }

    listaOrcamento.innerHTML = selecionados.map(s => `
        <li><span>${s.nome}</span><span class="item-preco">${s.preco} €</span></li>
    `).join('');

    const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
    orcamentoTotal.textContent = `${total} €/mês`;

    orcamentoTotal.classList.remove('pulso');
    void orcamentoTotal.offsetWidth;
    orcamentoTotal.classList.add('pulso');
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
        atualizarStepper();
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
            atualizarStepper();
        });
    });

    blocoHorarios.hidden = false;
    atualizarResumoMarcacao();
    renderResumoFinal();
    atualizarStepper();
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
        ? `Aula marcada: ${formatarDataPt(estado.dataEscolhida)} às ${estado.horaEscolhida}`
        : `Escolhe um horário disponível para ${formatarDataPt(estado.dataEscolhida)}.`;
}

// ------------------------------------------------
// Resumo final (dentro do formulário de inscrição)
// ------------------------------------------------
const resumoServicos = document.getElementById('resumoServicos');
const resumoHorario = document.getElementById('resumoHorario');

function renderResumoFinal() {
    const selecionados = catalogoServicos.filter(s => estado.servicosSelecionados.has(s.id));

    if (selecionados.length === 0) {
        resumoServicos.textContent = 'Nenhum programa selecionado ainda.';
    } else {
        const total = selecionados.reduce((soma, s) => soma + s.preco, 0);
        resumoServicos.textContent = `Programas: ${selecionados.map(s => s.nome).join(', ')} — Mensalidade: ${total} €`;
    }

    resumoHorario.textContent = (estado.dataEscolhida && estado.horaEscolhida)
        ? `Aula experimental: ${formatarDataPt(estado.dataEscolhida)} às ${estado.horaEscolhida}`
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
        `Nome do atleta: ${nome}\nEmail: ${email}\nTelefone: ${telefone || '-'}\n\n` +
        `Programas escolhidos: ${resumoServicosTexto}\nMensalidade estimada: ${total} €\n` +
        `Aula experimental: ${resumoHorarioTexto}\n\nMensagem:\n${mensagem || '-'}`;

    // Enquanto o Formspree não estiver configurado, usa mailto como alternativa
    if (FORMSPREE_URL.includes('XXXXXXXX')) {
        const assunto = encodeURIComponent(`Nova inscrição de ${nome}`);
        window.location.href = `mailto:${EMAIL_NEGOCIO}?subject=${assunto}&body=${encodeURIComponent(corpoCompleto)}`;
        formNota.textContent = 'A abrir o teu email para enviares a inscrição... (liga o Formspree para enviar sem sair da página)';
        formNota.className = 'form-nota';
        estado.inscricaoEnviada = true;
        atualizarStepper();
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
            formNota.textContent = 'Inscrição enviada com sucesso! Entraremos em contacto em breve.';
            formNota.className = 'form-nota sucesso';
            estado.inscricaoEnviada = true;
            formContacto.reset();
            estado.servicosSelecionados.clear();
            estado.dataEscolhida = null;
            estado.horaEscolhida = null;
            blocoHorarios.hidden = true;
            renderCatalogo();
            renderOrcamento();
            renderResumoFinal();
            renderResumoFlutuante();
            atualizarStepper();
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
renderResumoFlutuante();
atualizarStepper();
ativarRevelacao(document.querySelectorAll('.orcamento-caixa, .marcacoes-caixa, .contacto-form'));
