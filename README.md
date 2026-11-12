# Template "Interativo": Aro Alto (Academia de Basquetebol)

Template interativo para negócios de serviços por sessão ou aula, aqui vestido como uma academia de basquetebol. Só HTML, CSS e JavaScript: sem frameworks, sem servidor, sem base de dados.

## O que inclui

- **Abertura animada "Drible":** a águia cai do céu, faz drible e sobe com a bola enquanto a cortina abre. Tem botão "Saltar" e respeita quem prefere menos movimento.
- **Águia viva:** bate as asas, os olhos seguem o rato, pisca, e ao clicar faz uma cambalhota e fala.
- **Anúncio "Inscrições abertas":** mensagens que rodam e um painel de vagas por escalão. Clicar num escalão abre os programas já filtrados.
- **Layout de clube desportivo:** próximo jogo com contagem decrescente, faixa que corre, resultados e classificação, equipa técnica, notícias e parceiros.
- **Motor interativo:** catálogo de programas filtrável, placard de mensalidade em tempo real, marcação de aula experimental (data e horário), indicador de progresso e inscrição que junta tudo numa mensagem.

## Ficheiros

| Ficheiro | Para que serve |
|---|---|
| `index.html` | A página |
| `style.css` | Todo o visual. As cores estão nas variáveis `:root` no topo |
| `script.js` | Programas (`catalogoServicos`), simulador, marcações, envio, e os dados do clube (`CLUBE`: vagas, resultados, equipa, notícias, parceiros) |
| `mascote.js` | O desenho da águia e as suas reações |
| `abertura.js` | A abertura animada |

## Como adaptar a outro negócio

1. **Cores:** em `style.css`, no bloco `:root` (`--lar` e `--amb` são o laranja e o âmbar).
2. **Nome e logótipo:** em `index.html`, troca "ARO ALTO" e o ícone do cabeçalho e do rodapé.
3. **Programas e preços:** em `script.js`, edita `catalogoServicos`.
4. **Vagas, jogos, equipa, notícias e parceiros:** em `script.js`, edita `CLUBE`. A categoria de cada vaga (`cat`) tem de coincidir com a de um programa do catálogo.
5. **Mascote:** o desenho está em `mascote.js`. Para outro negócio, troca-o por outro desenho SVG ou apaga o mascote e a abertura.
6. **Sem abertura:** apaga a última linha de `abertura.js` (a que chama `abrirAbertura`).
7. **Envio de emails a sério:** cria uma conta grátis em [formspree.io](https://formspree.io), cria um formulário e troca `FORMSPREE_URL` em `script.js`. Enquanto não trocares, a inscrição abre o email do visitante já preenchido. Troca também `EMAIL_NEGOCIO`.

## Limitações a explicar ao cliente

- As marcações não ficam guardadas nem sincronizadas num calendário real: é um pedido que chega por email para confirmação manual. A disponibilidade de horários é simulada.
- O cálculo da mensalidade é uma estimativa com preços fixos (sem descontos, IVA ou promoções).
- Os resultados, a classificação, as vagas, as notícias e os parceiros são de exemplo. As imagens são ilustrações SVG originais.

## Publicar online

**Render (Static Site):** envia o projeto para o GitHub, em *New + → Static Site* escolhe o repositório, deixa o *Build Command* vazio e põe `.` em *Publish Directory*. Cada `git push` atualiza o site.

**GitHub Pages:** *Settings → Pages → Deploy from a branch → main / (root)*.
