# Prompt para Lovable — Site de Auto Check-in da Shanti Pousada

> **Como usar:** copie TUDO abaixo do separador `---` e cole na primeira mensagem do seu projeto novo no Lovable. Depois itere com mensagens menores conforme precisar de ajustes.

---

Construa um site de auto check-in para uma pousada chamada **Shanti Pousada**, em São Jorge (Chapada dos Veadeiros, Goiás). O hóspede chega por canais como Airbnb e Booking, e a pousada não tem recepção física — o site organiza a chegada e entrega códigos de acesso.

## Stack e estrutura

- React + Tailwind CSS
- Single-page application com client-side routing (React Router)
- 4 rotas: `/`, `/cadastro`, `/confirmado`, `/chegada`
- Sem backend próprio nessa v1 — o formulário envia dados pra um endpoint do Google Apps Script (URL a configurar depois) E abre uma URL `wa.me` em nova aba
- A página `/chegada` lê parâmetros da URL: `?quarto=caliandra&checkin=2026-05-20&nome=Marina`

## Design tokens

- Cor primária: `#3a5b78` (azul sóbrio Shanti)
- Cor de hover/escurecido: `#2c4a64`
- Cor primária suave: `#dde6ed`
- Fundo: `#f5f1ea` (creme quente)
- Tinta principal: `#2b2a26`
- Tinta secundária (muted): `#7a766e`
- Linhas/bordas: `#d9d3c6`
- Cards: `#fffdf8`
- Tom de alerta: `#a0522d`
- Fonte: stack do sistema (`-apple-system, system-ui, "Segoe UI", sans-serif`)
- Aspecto geral: sóbrio, espaçoso, sem floreios, tipografia limpa

## Tom de voz da marca

- Sóbrio, direto, sem hooks de marketing
- Não usar emojis em excesso (o WhatsApp pode ter um, o site não)
- Nunca usar a palavra "Veadeiros" sozinha (está no nome da pousada apenas por SEO). Sempre referir como "Chapada", "Chapada dos Veadeiros" ou "São Jorge"
- Tratamento amistoso mas profissional

## Estrutura dos dados de quartos

A pousada tem 6 acomodações. Cada uma tem um nome com prefixo (Suíte, Duplex ou Chalé) e regras próprias de configuração de cama. Crie um objeto JS com isso:

```js
const rooms = {
  caliandra: {
    label: 'Suíte Caliandra', article: 'a',
    configs: ['Casal (2 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'A Suíte Caliandra acomoda apenas casal ou uso individual.',
    codigoCofrinho: '0004'
  },
  mangaba: {
    label: 'Suíte Mangaba', article: 'a',
    configs: ['Casal (2 pessoas)', '2 solteiros (2 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'A Suíte Mangaba acomoda casal, 2 solteiros ou uso individual.',
    codigoCofrinho: 'A_DEFINIR'
  },
  caninde: {
    label: 'Duplex Caninde', article: 'o',
    configs: ['Casal (2 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'O Duplex Caninde acomoda apenas casal ou uso individual.',
    codigoCofrinho: 'A_DEFINIR'
  },
  seriema: {
    label: 'Duplex Seriema', article: 'o',
    configs: ['Casal (2 pessoas)', 'Casal + 1 solteiro (3 pessoas)', 'Casal + 2 solteiros (4 pessoas)', '2 solteiros (2 pessoas)', '3 solteiros (3 pessoas)', '4 solteiros (4 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'O Duplex Seriema acomoda até 4 pessoas — diversas configurações disponíveis.',
    codigoCofrinho: 'A_DEFINIR'
  },
  maytreia: {
    label: 'Chalé Maytreia', article: 'o',
    configs: ['Casal (2 pessoas)', 'Casal + 1 solteiro (3 pessoas)', '2 solteiros (2 pessoas)', '3 solteiros (3 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'O Chalé Maytreia acomoda até 3 pessoas — casal, casal+solteiro, 3 solteiros ou uso individual.',
    codigoCofrinho: 'A_DEFINIR'
  },
  mantra: {
    label: 'Chalé Mantra', article: 'o',
    configs: ['Casal (2 pessoas)', 'Solteiro — uso individual (1 pessoa)'],
    note: 'O Chalé Mantra acomoda apenas casal ou uso individual.',
    codigoCofrinho: 'A_DEFINIR'
  }
};
```

Código do portão é fixo para todos os quartos: **`002`**.

## Página 1 — Landing (`/`)

Hero centralizado com:
- Logo discreto (texto): "SHANTI POUSADA" em letras espaçadas (letter-spacing 4px, uppercase, fonte pequena, cor muted)
- Título: "Bem-vindo(a), {nome}." (puxa de `?nome=` na URL; fallback: "Bem-vindo à Shanti Pousada")
- Subtítulo: "Sua estadia em São Jorge começa em {dias} dias. Vamos organizar o check-in com calma, antes da chegada." (calcula `dias` a partir de `?checkin=` na URL)
- 2 CTAs empilhados (max-width 340px):
  - Primário (azul): "Fazer pré-check-in (2 min)" → leva pra `/cadastro` mantendo os params da URL
  - Secundário (outline): "Falar com a Shanti no WhatsApp" → abre `https://wa.me/5521964077224`

Abaixo do hero, grid de 3 info-cards lado a lado (single column no mobile):
1. **Sua reserva** — Quarto (do `rooms[quarto].label`) · {noites} noites · Check-in {data} a partir das 14h · Check-out {data+noites} até 12h
2. **Onde fica** — Rua dos Ipês, lote 1 · Vila de São Jorge, Alto Paraíso de Goiás
3. **Como funciona** — Auto check-in (sem recepção). Genilda no espaço para apoio presencial.

## Página 2 — Formulário (`/cadastro`)

Container max-width 760px. Header pequeno com "SHANTI POUSADA · PRÉ-CHECK-IN" em uppercase muted. Título: "Conta pra gente sobre sua chegada". Subtítulo muted: "Leva 2 minutos. Tudo isso fica registrado para você não precisar repetir na chegada."

Card de formulário (fundo card, borda, padding 36px). Barra de progresso visual no topo (4 segmentos, 2 preenchidos).

**Seções:**

### Hóspede principal
- Nome completo (text, required)
- CPF ou documento (text, placeholder "000.000.000-00") + E-mail (email, placeholder "seu@email.com") — lado a lado

### Quem vai usar {a/o} {label do quarto}
- Configuração (select, populado dinamicamente do `rooms[quarto].configs`)
- Nota muted abaixo do select: `rooms[quarto].note`
- Nome do(s) acompanhante(s) (text, opcional, placeholder "Nome completo de quem vem com você")

### Chegada
- Horário previsto (select) + Como vai chegar (select) — lado a lado
  - Horário: "Entre 14h e 16h", "Entre 16h e 18h", "Depois das 18h", "Não sei ainda"
  - Meio: "Carro próprio", "Van/transfer", "Carona"

### Antes de fechar
- Pedido especial (textarea, opcional, placeholder "Alergia, preferência, qualquer coisa que devemos saber...")
- Checkbox marcado por padrão: "Li e aceito as regras da casa (silêncio 22h-8h, não-fumantes nas áreas internas, sem festas)."

**Botão final centralizado**: "Confirmar e abrir WhatsApp" (azul, padding 14px 32px, inline-block).

Pequena nota muted centralizada abaixo: "Vamos abrir o WhatsApp com sua mensagem pronta. Você só precisa tocar em 'Enviar'."

**Ação ao submeter:**
1. (Futuro) Enviar todos os dados do formulário via POST para o endpoint Google Apps Script (URL configurável em uma constante no topo do código — deixar `const SHEETS_ENDPOINT = "<COLOCAR_AQUI>";` para configurar depois)
2. Construir mensagem WhatsApp e abrir `https://wa.me/5521964077224?text=...` em nova aba (`window.open(url, '_blank')`)
3. Navegar pra `/confirmado` (mantendo params da URL)

**Template da mensagem WhatsApp:**
```
Olá Paula, aqui é {nome}.
Acabei de fazer o pré-check-in pelo site da Shanti:

• Acomodação: {label do quarto}
• Chegada: {data} — {horário}
• Configuração: {config selecionada}
• Acompanhante: {nome do acompanhante, se houver}
• Como vou chegar: {meio}
• E-mail: {email, se houver}

Observação: {obs, se houver}

Aguardo as instruções de acesso. Obrigada!
```

## Página 3 — Confirmação (`/confirmado`)

Container max-width 760px. Hero centralizado:
- Círculo com check ✓ (azul claro de fundo, azul escuro do ícone)
- Título: "Tudo certo, {nome}."
- Subtítulo muted: "Sua conversa com a Paula foi aberta no WhatsApp. Toque em 'Enviar' lá quando quiser — ela responde rápido."

Card de download do PDF (visível imediatamente, **sem lock**):
- Ícone "PDF" em quadrado azul claro
- Título: "Informes e regras da Shanti"
- Subtítulo muted: "Disponível agora — boa leitura para se preparar"
- Botão "Baixar" (azul) → faz download do arquivo PDF (placeholder por enquanto: `/arquivos/politicas-shanti.pdf` — você sobe o arquivo real no Lovable depois)

Section centralizada:
- Título h3: "Sua página de chegada"
- Texto: "Aqui ficam os códigos do quarto, o vídeo de acesso e tudo que você vai precisar. Os códigos liberam automaticamente **24h antes do dia {data}**."
- Botão centralizado azul: "Ver minha página de chegada" → leva pra `/chegada` com os params
- Nota muted: "Você pode salvar este link e voltar a qualquer momento."

## Página 4 — Página de Chegada (`/chegada`)

Container max-width 760px. Esta é a página mais importante — funciona com dois estados, **automaticamente decididos pelo tempo restante até a chegada**:

- **Bloqueado** — faltam mais de 24h para a chegada
- **Liberado** — faltam 24h ou menos, OU o checkout ainda não passou

Calcular: se `Date.now()` está dentro de `(checkin - 24h)` até `(checkout)`, estado = liberado. Senão, bloqueado.

**Header do tipo "card" com info do hóspede:**
- Tag muted uppercase: "SHANTI POUSADA · PÁGINA DE CHEGADA"
- Título: "Olá, {nome}"
- Subtítulo: "{label do quarto} · {noites} noites · chegada {data}"
- Badge no lado direito:
  - Se bloqueado: "🔒 Bloqueado" (fundo creme, texto marrom claro)
  - Se liberado: "✓ Liberado" (fundo azul claro, texto azul)

**Countdown / status (card centralizado):**

Se bloqueado:
- Label: "Códigos liberam em"
- Tempo grande: "{dias} dias · {horas}h · {minutos}min"
- Texto muted abaixo: "Por segurança, os códigos do portão e do quarto aparecem aqui 24h antes da chegada."

Se liberado:
- Label: "Sua chegada é {hoje/amanhã}"
- Tempo grande em verde: "Liberado para auto check-in ✓"
- Texto muted abaixo: "Check-in disponível a partir das 14h. Genilda está no espaço caso precise."

**Card "Códigos de acesso":**

Se bloqueado (fundo creme, borda tracejada):
- Linha 1: **Portão da pousada** / Manter trancado após passar — código: 🔒 — — —
- Linha 2: **Cofrinho da/do {label do quarto}** / Onde fica a chave do seu quarto — código: 🔒 — — — —

Se liberado (fundo card):
- Linha 1: **Portão da pousada** / Manter trancado após passar — código grande: **002** (monospace)
- Linha 2: **Cofrinho da/do {label do quarto}** / Onde fica a chave do seu quarto — código grande: **`rooms[quarto].codigoCofrinho`** (monospace)

**Card de vídeo:**

Se bloqueado (placeholder cinza):
- Ícone 🔒 grande
- Texto: "Vídeo de acesso libera 24h antes"
- Info abaixo: "Como chegar ao seu quarto / Vídeo curto mostrando o caminho do portão até a/o {label do quarto}."

Se liberado (frame escuro com play):
- Botão play grande
- Texto pequeno: "Vídeo de acesso · 15s"
- Info abaixo: "Como chegar ao seu quarto / Mostra o caminho do portão até a/o {label do quarto}. Assista antes da chegada."
- (Reproduz vídeo do arquivo `/arquivos/acesso.mp4` — placeholder por enquanto)

**Card de PDF** (sempre visível, sem lock):
- Ícone "PDF"
- Título: "Informes e regras da Shanti"
- Subtítulo: "Disponível agora"
- Botão "Baixar"

**Section "Sua estadia" (faq-style, sempre visível):**

- **Endereço**: Rua dos Ipês, lote 1 · Vila de São Jorge · Alto Paraíso de Goiás → link "Abrir no Google Maps →" (https://goo.gl/maps/KR5nDdn7DZUAHmPZ6)
- **Wi-Fi**: Rede **Shanti** / Senha **flordoceu** (em duas linhas)
- **Cozinha coletiva**: Disponível das 7h30 às 20h. Há um filtro com água gelada no refeitório e as torneiras das cozinhas privativas também têm filtro.
- **Café da manhã**: Não servimos, mas as cozinhas privativas e a cozinha coletiva têm itens básicos (sal, açúcar, óleo, temperos). Há também uma padaria e diversos outros estabelecimentos a 200m de nós que servem café da manhã.
- **Estacionamento**: Em São Jorge os estabelecimentos não têm estacionamento interno. A melhor opção é estacionar ao longo do meio-fio. Com relação à segurança, é muito tranquilo. Recomendamos ir a pé para o centrinho e aproveitar a Vila assim — é tudo bem próximo.
- **Check-in antecipado (sob disponibilidade)**: Nosso horário padrão é a partir das 14h. Entrada antes está sujeita à disponibilidade do quarto no dia. Para verificar, fale com a Paula pelo WhatsApp.

**Section "Antes de ir a São Jorge" (fundo amarelo claro, borda amarela):**

- **Não há caixas eletrônicos em São Jorge**: Traga dinheiro em espécie.
- **Não há posto de gasolina em São Jorge**: Abasteça antes.

**Card "Confirmar chegada" (só se liberado, fundo azul, texto branco):**
- Título: "Já chegou?"
- Texto: "Toque abaixo para nos avisar que você entrou na acomodação."
- Botão branco: "Confirmar minha chegada" (futuro: dispara um POST pro Sheets ou notifica a Paula)

**Card de suporte (sempre visível, no rodapé):**
- "Dúvidas, informações? Fale com a Paula: [WhatsApp (21) 96407-7224](https://wa.me/5521964077224)"
- "Apoio presencial na pousada: Genilda — [(62) 99854-6284](https://wa.me/5562998546284)"

## Restrições importantes

1. **Não inventar informação.** Use apenas o que está neste prompt. Se algum dado estiver faltando (ex: imagem de fundo, vídeo), deixe placeholder claro.
2. **Não usar "Veadeiros" sozinho.** Sempre "Chapada", "Chapada dos Veadeiros" ou "São Jorge".
3. **Não adicionar serviços extras** (massagens, transfers, passeios, café da manhã). Esses estão em estruturação e ficam fora da v1.
4. **Sem emojis no site** (exceção: ✓ na confirmação, 🔒 no estado bloqueado, ▶ no play do vídeo).
5. **Toda a interface em português brasileiro.**
6. **Responsivo:** funcionar bem no celular (a maioria dos hóspedes vai abrir pelo WhatsApp no celular).

## Dados de teste (para você visualizar enquanto desenvolve)

URL de teste: `?nome=Marina%20Pereira&quarto=caliandra&checkin=2026-05-20&checkout=2026-05-24`

Defaults se a URL não tiver params: nome "hóspede", quarto "caliandra", checkin daqui a 3 dias, checkout daqui a 7 dias.

---

Comece pela página `/chegada` e o sistema de routing. Depois faça as outras 3. Quando terminar a v1, eu volto pra ajustar copy e configurar a integração com Google Sheets e o arquivo do PDF/vídeo.
