# Template "Interativo" — Aro Alto (Academia de Basquetebol)

Exemplo temático (preto + laranja, "clássico de quadra") do template interativo: catálogo de programas filtrável, simulador de mensalidade em tempo real, marcação de aula experimental, indicador de progresso e um formulário final que envia a inscrição completa.

Este ficou com tema de basquetebol para mostrar como o mesmo motor funcional se veste de forma diferente — a estrutura por baixo (catálogo → cálculo → marcação → envio) serve qualquer negócio de serviços por sessão/aula (ginásios, explicações, clínicas, salões, etc.).

## Estrutura
- `index.html`
- `style.css`
- `script.js` — toda a lógica (catálogo, simulador, marcações, stepper, envio)

## Como funciona

1. **Catálogo** (`catalogoServicos` no topo de `script.js`) — lista de programas com categoria, preço mensal, ícone e descrição. Clicar em qualquer parte do cartão (ou na checkbox) adiciona à inscrição.
2. **Simulador de mensalidade** — atualiza sozinho, somando os preços dos programas selecionados. Um badge flutuante mostra o resumo em qualquer parte da página.
3. **Indicador de progresso (stepper)** — os 4 passos acendem a laranja conforme vão sendo concluídos (escolher programa → mensalidade calculada → aula marcada → inscrição enviada).
4. **Marcação de aula experimental** — escolhe-se uma data; os horários disponíveis aparecem automaticamente (a "indisponibilidade" é simulada — não há calendário real ligado, por isso não substitui um sistema de reservas com pagamento ou confirmação por SMS).
5. **Envio da inscrição** — junta nome, contacto, programas escolhidos e horário numa única mensagem.

## Como adaptar a outro negócio/cliente

1. **Cores** — muda as variáveis no topo de `style.css` (`--cor-primaria`, `--cor-escuro`, etc.) para a paleta do cliente.
2. **Nome e ícone do logótipo** — em `index.html`, troca "ARO ALTO" e o SVG da bola no cabeçalho.
3. **Catálogo** — edita o array `catalogoServicos` em `script.js`: nome, categoria, preço, descrição e ícone (`bola`, `apito`, `camisola`, `cronometro` — podes adicionar mais ícones SVG no objeto `ICONES_SERVICO`, ou trocar por outros genéricos).
4. **Gráficos do hero** — o SVG das linhas de campo e a bola decorativa estão diretamente no `index.html` (`.hero-fundo`); para outro tema, troca por outro desenho SVG simples ou remove.
5. **Envio de emails a sério** — cria conta grátis em [formspree.io](https://formspree.io), cria um formulário, e troca `FORMSPREE_URL` no topo de `script.js` pelo URL que eles derem. Enquanto não configurares, o formulário funciona por email (mailto).
6. **Email de contacto do fallback** — troca `EMAIL_NEGOCIO` em `script.js`.

## Limitações a explicar ao cliente
- As marcações não ficam guardadas nem sincronizadas num calendário real — é um pedido que chega por email para confirmação manual. Para um sistema de reservas com base de dados, seria preciso um backend (como o Portal de Automação Interna, por exemplo).
- O cálculo da mensalidade é uma estimativa baseada em preços fixos — não lida com descontos, IVA ou promoções a não ser que se adicione essa lógica.
- As imagens são ilustrações SVG originais (sem direitos de autor), não fotos reais — para um cliente a sério, o ideal é substituir por fotos verdadeiras da equipa/instalações quando existirem.

## Publicar online
Igual ao template "vitrine": repositório no GitHub + Render (Static Site) ou GitHub Pages, gratuito.
