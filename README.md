# Template "Interativo"

Versão do template genérico com funcionalidades reais: catálogo de serviços filtrável, calculadora de orçamento em tempo real, marcação de horário, e um formulário final que envia o pedido completo.

## Estrutura
- `index.html`
- `style.css`
- `script.js` — toda a lógica (catálogo, orçamento, marcações, envio)

## Como funciona

1. **Catálogo** (`catalogoServicos` no topo de `script.js`) — lista de serviços com categoria, preço e descrição. O cliente marca os que quer.
2. **Orçamento** — atualiza sozinho, somando os preços dos serviços marcados.
3. **Marcações** — o cliente escolhe uma data; os horários disponíveis aparecem automaticamente (a "indisponibilidade" é simulada — não há calendário real ligado, por isso não substitui um sistema de reservas com pagamento ou confirmação por SMS).
4. **Envio do pedido** — junta nome, contacto, serviços escolhidos e horário numa única mensagem.

## Como adaptar a um cliente novo

1. **Cores** — mesmo princípio do template "vitrine": muda as variáveis no topo de `style.css`.
2. **Catálogo de serviços** — edita o array `catalogoServicos` em `script.js`: nome, categoria, preço, descrição e ícone (`consultoria`, `instalacao` ou `manutencao` — podes adicionar mais ícones SVG no objeto `ICONES_SERVICO`).
3. **Envio de emails a sério** — cria conta grátis em [formspree.io](https://formspree.io), cria um formulário, e troca `FORMSPREE_URL` no topo de `script.js` pelo URL que eles derem. Enquanto não configurares, o formulário funciona por email (mailto).
4. **Email de contacto do fallback** — troca `EMAIL_NEGOCIO` em `script.js`.
5. **Textos e nome do negócio** — em `index.html`, tal como no outro template.

## Limitações a explicar ao cliente
- As marcações não ficam guardadas nem sincronizadas num calendário real — é um pedido que chega por email para confirmação manual. Para um sistema de reservas com base de dados, seria preciso um backend (como o Portal de Automação Interna, por exemplo).
- O cálculo do orçamento é uma estimativa baseada em preços fixos — não lida com descontos, IVA ou variações por localização a não ser que se adicione essa lógica.

## Publicar online
Igual ao template "vitrine": repositório no GitHub + GitHub Pages, gratuito.
