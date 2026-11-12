// ============================================
// MASCOTE — a águia do Aro Alto
// Desenhada em SVG e animada só com CSS + um pouco de JavaScript.
//  - mascoteInterior(): só o desenho (para usar dentro de outras cenas SVG)
//  - mascoteSVG():      o desenho dentro de um <svg> pronto a usar
//  - ativarMascote():   olhos e cabeça seguem o rato, clique faz uma cambalhota e fala
// ============================================

const BOLA_INTERIOR = `
    <circle cx="50" cy="72" r="9" fill="#fff" stroke-width="2.5"/>
    <path d="M41 72h18M50 63v18M43.5 65.5c2.5 2.5 2.5 10 0 13M56.5 65.5c-2.5 2.5-2.5 10 0 13" stroke="#ff6b00" stroke-width="1.4" fill="none"/>`;

function mascoteInterior(o = {}) {
    const bola = o.bola !== false;
    return `
    <g class="m-corpo">
        <g class="m-cabeca">
            <path d="M45 15 L43 6 L49 13 Z" stroke-width="1.6"/>
            <path d="M55 15 L57 6 L51 13 Z" stroke-width="1.6"/>
            <circle cx="50" cy="24" r="11" fill="#fff" stroke-width="2.5"/>
            <g class="m-olho"><circle cx="45" cy="23" r="3.1" fill="#fff" stroke-width="1.4"/><circle class="m-pupila" cx="45" cy="23.2" r="1.7" fill="#0d0d0d" stroke="none"/></g>
            <g class="m-olho"><circle cx="55" cy="23" r="3.1" fill="#fff" stroke-width="1.4"/><circle class="m-pupila" cx="55" cy="23.2" r="1.7" fill="#0d0d0d" stroke="none"/></g>
            <path d="M45 29 L50 26 L55 29 L50 37 Z" stroke-width="2"/>
        </g>
        <path d="M50 34 C 42 40, 40 48, 42 58 L58 58 C 60 48, 58 40, 50 34 Z" stroke-width="2.5"/>
        <g class="m-asa m-asa-e">
            <path d="M42 40 C 20 42, 4 55, 2 78 C 16 70, 26 66, 40 60 C 40 55, 40 46, 42 40 Z" fill="#ff7a1a" stroke-width="2.5"/>
            <path d="M10 62 C 8 66, 6 72, 4 78" fill="none" stroke-width="1.6"/>
            <path d="M18 58 C 16 64, 14 70, 12 76" fill="none" stroke-width="1.6"/>
            <path d="M28 55 C 26 61, 24 67, 22 73" fill="none" stroke-width="1.4"/>
        </g>
        <g class="m-asa m-asa-d">
            <path d="M58 40 C 80 42, 96 55, 98 78 C 84 70, 74 66, 60 60 C 60 55, 60 46, 58 40 Z" fill="#ff7a1a" stroke-width="2.5"/>
            <path d="M90 62 C 92 66, 94 72, 96 78" fill="none" stroke-width="1.6"/>
            <path d="M82 58 C 84 64, 86 70, 88 76" fill="none" stroke-width="1.6"/>
            <path d="M72 55 C 74 61, 76 67, 78 73" fill="none" stroke-width="1.4"/>
        </g>
        ${bola ? `<g class="m-bola">${BOLA_INTERIOR}</g>` : ''}
    </g>`;
}

function mascoteSVG(o = {}) {
    return `<svg class="mascote ${o.classe || ''}" viewBox="0 0 100 100" fill="#ff6b00" stroke="#0d0d0d" stroke-width="2" stroke-linejoin="round" role="img" aria-label="Águia, mascote do Aro Alto">${mascoteInterior(o)}</svg>`;
}

const FRASES_MASCOTE = [
    'Bora treinar!', 'Hoje há aula experimental grátis!', 'Já escolheste o teu programa?',
    'Passa a bola!', 'Dois pontos garantidos!', 'Aqui ninguém fica no banco.', 'Quem não arrisca não encesta!'
];

function ativarMascote(svg, opcoes = {}) {
    if (!svg) return;
    const area = opcoes.area || document;
    const pupilas = svg.querySelectorAll('.m-pupila');
    const cabeca = svg.querySelector('.m-cabeca');
    const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let quadro = null, alvo = null;

    function aplicar() {
        quadro = null;
        if (!alvo) return;
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height * 0.28;
        const dx = Math.max(-1, Math.min(1, (alvo.x - cx) / (innerWidth * 0.45)));
        const dy = Math.max(-1, Math.min(1, (alvo.y - cy) / (innerHeight * 0.45)));
        pupilas.forEach(p => { p.style.transform = `translate(${(dx * 1.5).toFixed(2)}px, ${(dy * 1.2).toFixed(2)}px)`; });
        if (cabeca) cabeca.style.transform = `rotate(${(dx * 7).toFixed(2)}deg)`;
        svg.style.setProperty('--px', (dx * 12).toFixed(1) + 'px');
        svg.style.setProperty('--py', (dy * 8).toFixed(1) + 'px');
    }
    if (!reduzido) {
        area.addEventListener('pointermove', e => {
            alvo = { x: e.clientX, y: e.clientY };
            if (!quadro) quadro = requestAnimationFrame(aplicar);
        }, { passive: true });
    }

    // pisca de vez em quando
    (function piscar() {
        svg.classList.add('pisca');
        setTimeout(() => svg.classList.remove('pisca'), 160);
        setTimeout(piscar, 2600 + Math.random() * 3200);
    })();

    // clique: cambalhota, a bola salta e a águia fala
    const balao = opcoes.balao;
    let timerBalao = null, i = 0;
    function festa() {
        svg.classList.remove('festa');
        void svg.getBoundingClientRect();
        svg.classList.add('festa');
        if (balao) {
            balao.textContent = FRASES_MASCOTE[i++ % FRASES_MASCOTE.length];
            balao.classList.add('visivel');
            clearTimeout(timerBalao);
            timerBalao = setTimeout(() => balao.classList.remove('visivel'), 2400);
        }
    }
    svg.addEventListener('click', festa);
    svg.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); festa(); } });
    svg.setAttribute('tabindex', '0');
    svg.addEventListener('animationend', e => { if (e.animationName === 'm-cambalhota') svg.classList.remove('festa'); });
}
