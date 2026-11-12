// ============================================
// ABERTURA ANIMADA "Drible"
// A águia cai do céu, faz drible no meio do campo enquanto o nome do clube aparece,
// sobe com a bola e a cortina abre para cima.
// Para ter o site sem abertura, apaga a chamada a abrirAbertura() no fim deste ficheiro.
// ============================================

const VARIANTE_PADRAO = 'a';

const COR = { lar: '#ff6b00', amb: '#ffb100', pre: '#0d0d0d' };

function grupoMascote(x, y, esc, o) {
    return `<g transform="translate(${x} ${y}) scale(${esc})" fill="${COR.lar}" stroke="${COR.pre}" stroke-width="2" stroke-linejoin="round">${mascoteInterior(o)}</g>`;
}

function bolaGrande(cx, cy, r) {
    const s = 4;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ff7a1a" stroke="${COR.pre}" stroke-width="${s}"/>
        <path d="M${cx - r} ${cy}H${cx + r}M${cx} ${cy - r}V${cy + r}" stroke="${COR.pre}" stroke-width="${s - 1}" fill="none"/>
        <path d="M${cx - r * 0.72} ${cy - r * 0.7}Q${cx - r * 0.18} ${cy} ${cx - r * 0.72} ${cy + r * 0.7}M${cx + r * 0.72} ${cy - r * 0.7}Q${cx + r * 0.18} ${cy} ${cx + r * 0.72} ${cy + r * 0.7}" stroke="${COR.pre}" stroke-width="${s - 1}" fill="none"/>
        <path d="M${cx - r * 0.55} ${cy - r * 0.62}a${r * 0.7} ${r * 0.7} 0 0 1 ${r * 0.5} -${r * 0.2}" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round" fill="none"/>`;
}

const LINHAS_CAMPO = `<svg class="ab-linhas" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <circle cx="400" cy="250" r="120" fill="none" stroke="currentColor" stroke-width="2"/>
    <line x1="0" y1="250" x2="800" y2="250" stroke="currentColor" stroke-width="2"/>
    <path d="M0 90 Q 180 250 0 410" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M800 90 Q 620 250 800 410" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;

function marca(texto) {
    return `<p class="ab-marca" aria-hidden="true">${[...texto].map((c, i) => c === ' ' ? '<span class="esp"></span>' : `<span style="--i:${i}">${c}</span>`).join('')}</p>`;
}

// ---------- A: Drible ----------
const cenaA = () => `
<svg class="ab-cena" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <line x1="120" y1="740" x2="880" y2="740" stroke="${COR.lar}" stroke-opacity=".55" stroke-width="3"/>
    <ellipse class="ia-onda" cx="500" cy="740" rx="120" ry="16" fill="none" stroke="${COR.amb}" stroke-width="3"/>
    <ellipse class="ia-sombra" cx="500" cy="744" rx="70" ry="11" fill="#000"/>
    <g class="ia-aguia"><g class="ia-flut">${grupoMascote(320, 40, 3.6, { bola: true })}</g></g>
    <g class="ia-bola">${bolaGrande(500, 455, 60)}</g>
</svg>`;

// ---------- montagem comum ----------
const VARIANTES = {
    a: { nome: 'Drible', cena: cenaA, carga: 3400, final: 3500, saida: 4350, fecha: 950 }
};

let aberturaTimers = [];
let aberturaRaf = 0;

function limparAbertura() {
    aberturaTimers.forEach(clearTimeout); aberturaTimers = [];
    cancelAnimationFrame(aberturaRaf);
    document.getElementById('abertura')?.remove();
}

function terminarAbertura() {
    const raiz = document.getElementById('abertura');
    if (!raiz) return;
    raiz.classList.add('saida');
    document.body.classList.add('pronto');
    aberturaTimers.push(setTimeout(() => {
        raiz.remove();
        document.body.classList.remove('carregando');
        document.dispatchEvent(new Event('abertura:fim'));
    }, Number(raiz.dataset.fecha) || 950));
}

function abrirAbertura(variante) {
    variante = VARIANTES[variante] ? variante : VARIANTE_PADRAO;
    limparAbertura();
    document.body.classList.remove('pronto');
    document.documentElement.dataset.abertura = variante;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('pronto');
        document.body.classList.remove('carregando');
        document.dispatchEvent(new Event('abertura:fim'));
        return;
    }
    scrollTo(0, 0);
    document.body.classList.add('carregando');
    const v = VARIANTES[variante];
    const raiz = document.createElement('div');
    raiz.id = 'abertura';
    raiz.className = `ab-${variante}`;
    raiz.setAttribute('aria-hidden', 'true');
    raiz.dataset.fecha = v.fecha;
    raiz.innerHTML = `
        <div class="ab-fundo"></div>${LINHAS_CAMPO}${v.cena()}${marca('ARO ALTO')}
        <p class="ab-dica">Academia de Basquetebol</p>
        <p class="ab-contador"><span id="abNum">0</span>%</p>
        <button type="button" class="ab-saltar" id="abSaltar">Saltar</button>`;
    document.body.prepend(raiz);

    // contador
    const num = raiz.querySelector('#abNum');
    const inicio = performance.now();
    (function passo(t) {
        const p = Math.min(1, (t - inicio) / v.carga);
        num.textContent = Math.round(p * 100);
        if (p < 1) aberturaRaf = requestAnimationFrame(passo);
        else raiz.classList.add('carregado');
    })(inicio);

    raiz.querySelector('#abSaltar').addEventListener('click', terminarAbertura);

    aberturaTimers.push(setTimeout(() => raiz.classList.add('ab-final'), v.final));
    aberturaTimers.push(setTimeout(terminarAbertura, v.saida));
}

// ---------- arranque ----------
(function () {
    abrirAbertura(VARIANTE_PADRAO);
})();
