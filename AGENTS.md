# AGENTS.md — shanti-auto-checkin

App de auto check-in para hóspedes da Shanti Pousada.

## Stack

- TanStack Start + TypeScript
- Deploy: Cloudflare Workers → checkin.shantipousada.com.br (domínio dos hóspedes)
  - tanstack-start-app.shanti-checkin.workers.dev segue ativo: links antigos já enviados apontam para ele
- Repo: Krispino/shanti-auto-checkin
- Captura de dados: Google Sheets via Google Apps Script
- Design: paleta do site oficial (shantipousada.com.br) — azul `#3a5b78` como
  primária, terracota `#b85838` como acento. A terracota é sempre sólida
  (fundo cheio ou texto/borda), nunca diluída — não existe "terracota suave"
  no site, e não deve existir no app.

### Contas (confirmar antes de deploy)

- **Cloudflare: `shantipousada@gmail.com`** — NÃO é a conta pessoal
  `crispimfabio@gmail.com`. O Worker, o subdomínio `shanti-checkin.workers.dev`
  e a zona `shantipousada.com.br` estão todos nessa conta. Logar com a conta
  errada faz o deploy criar um Worker paralelo e inútil. Conferir com
  `bunx wrangler whoami` antes de publicar.
- **Apps Script: o código real vive no Google, não neste repo.** Projeto
  CHECKIN.APP, preso à planilha "SHANTI CHECKIN CADASTROS" (conta
  `shantipousada@gmail.com`). Os `.md` em `docs/apps-script-*.md` guardam só os
  trechos (agenda, leitor do Innotel, consulta de quarto); o `doPost` e a
  gravação na planilha não estão aqui. O script tem o token escrito no código,
  então nunca copiar o arquivo inteiro para o repo. Última versão publicada: 31
  (01/11/2026, e-mails de aviso passam pra Joelice; a 29 adicionou `acao=quarto`).
- Segredos no Worker (via `wrangler secret put`): `SHEETS_TOKEN` (token do Apps
  Script) e `ADMIN_SENHA` (senha do /admin, com fallback em `src/server.ts`).
  Trocar `ADMIN_SENHA` derruba a sessão salva no navegador de todo mundo
  (ver "Sessão do admin" abaixo) — quem usa precisa logar de novo.

## Rotas

- `/` — entrada
- `/cadastro` — formulário do hóspede (indexável — é a porta de entrada)
- `/confirmado` — confirmação, com card de roteiros do site (`noindex`)
- `/chegada` — códigos de acesso e vídeo (`noindex` — mostra segredos)
- `/admin` — ferramenta interna (`noindex`, prévia própria sem foto de marketing)
- `/api/buscar`, `/api/login`, `/api/checar-duplicata`, `/api/quarto-reserva` —
  endpoints do Worker (`src/server.ts`), protegidos por `ADMIN_SENHA` exceto os
  dois públicos: o de duplicata só devolve `{existe: boolean}` e o de
  quarto-reserva só devolve `{quartoKey}` (achado na agenda por nome + data de
  entrada); nenhum devolve dado de hóspede
- `robots.txt` bloqueia `/chegada`, `/admin`, `/confirmado` e `/api/`

## Sessão do admin

A senha fica em `localStorage` do navegador (chave `shanti_admin_senha`) e é
revalidada no servidor a cada abertura — login só é pedido uma vez por
aparelho. Tem um "sair deste aparelho" na tela para limpar o acesso local.

## Fluxo de reserva → chegada (peças que already existem)

1. Hóspede reserva numa OTA ou direto.
2. Recebe o link de `/cadastro` (idealmente pré-preenchido via query string:
   `?nome=...&quarto=...&checkin=...&checkout=...` — o formulário usa esses
   valores só se vierem de fato na URL, nunca inventa padrão). Sem `quarto` na
   URL (link genérico da mensagem automática da OTA), o formulário descobre o
   quarto sozinho: ao digitar nome + data de entrada, consulta
   `/api/quarto-reserva`, que procura o evento criado pelo e-mail do Innotel.
   Se não achar, o hóspede escolhe na lista — não existe mais "Não sei".
3. Ao enviar, o Apps Script (`doPost`, ver `docs/apps-script-agenda.md`):
   grava na planilha, cria/atualiza o evento no Google Agenda (cor por
   acomodação, título `Nome · Quarto · Plataforma`) e manda e-mail para o
   Fabio **e** o apoio local. Isso não depende de o hóspede tocar em "Enviar" no
   WhatsApp — o aviso por e-mail é o que garante que o Fabio saiba do
   cadastro mesmo se o hóspede fechar a conversa sem enviar.
4. Se o hóspede já tinha cadastro para a mesma data, aparece a pergunta
   "precisa refazer?" — respondendo "não, já está tudo certo" abre o
   WhatsApp com uma confirmação curta (não é uma tela morta).
5. O Fabio usa `/admin` pra gerar o link de `/chegada` e mandar pelo
   WhatsApp — a mensagem muda de texto conforme falte mais ou menos de 24h
   pra chegada (`docs/mensagens.md` tem os textos de referência,
   incluindo a mensagem automática das OTAs).
6. Em `/chegada`, liberado às 14h do dia da chegada (horário do check-in): códigos
   do portão/cofrinho e vídeo. Link sem `?quarto=` válido mostra "Não
   identificamos a sua acomodação" — nunca assume um quarto.
   Confirmar chegada abre WhatsApp e mostra um card convidando pros
   roteiros do site (`shantipousada.com.br/chapada-dos-veadeiros/`).

## Regras invioláveis

0. Nenhuma página mostra vídeo, código ou nome de quarto sem saber de fato qual
   é o quarto (vindo da URL ou da agenda). Nunca cair em "caliandra" por
   padrão — já mostrou o vídeo errado para hóspedes do Mantra. O `<video>` de
   `/chegada` usa `key` + `src` por quarto: trocar só um `<source>` filho não
   recarrega o vídeo.

1. O formulário `/cadastro` é UMA página única com scroll. Nunca multi-step.
2. No app, conteúdo voltado a hóspedes não traz nome próprio: os contatos são
   `WHATSAPP_SHANTI` (reservas — hoje é o Fabio, a Paula e a Ekko saíram em
   set/2026) e `WHATSAPP_JOELICE` (apoio local — Joelice, (62) 99369-8085, cobrindo licença-maternidade até ~mar/2027). A regra vale para o produto,
   não para as conversas — nelas o Fabio se identifica pelo nome, e deve:
   número desconhecido mandando link é o que mais parece golpe.
3. Toda mudança no código do Google Apps Script exige REPUBLICAR como nova
   versão (Implementar → Gerenciar implementações → editar → **Nova
   versão**). Sem isso a mudança não vale — já aconteceu de "republicar"
   sem trocar a versão e nada mudar. Lembrar o Fabio disso em toda alteração.
4. Códigos de lockbox dos 6 quartos já foram corrigidos uma vez — antes de
   alterar qualquer código, confirmar com o Fabio o valor atual. Nunca
   inventar. Valores atuais em `src/lib/shanti.ts`: portão `002`; cofrinhos
   Caliandra `1000`, Mangaba `0200`, Caninde `0004`, Seriema `0030`,
   Maytreia `0005`, Mantra `0006`.
5. Vídeos das acomodações foram recomprimidos via ffmpeg — manter o padrão
   de compressão se novos vídeos entrarem.
6. A terracota do app é sempre sólida (ver Stack acima) — nunca criar um tom
   diluído/pastel dela sem conferir primeiro como o site realmente usa a cor.

## Quartos (mapeamento Booking.com) e configurações de cama

- Mangaba = Quarto Deluxe Casal + Varanda
- Caliandra = Quarto Duplo Deluxe com Varanda
- Seriema = Quarto Quádruplo Duplex
- Maytreia: apenas casal (king size) ou casal (king size) + 1 solteiro em
  cama adicional — sem outras variações de cama de casal.
- As opções de configuração mostradas no formulário já são filtradas pela
  acomodação escolhida (`rooms[quarto].configs` em `src/lib/shanti.ts`); a
  seção "Reserva" (plataforma + acomodação) vem antes de "Quem vai usar a
  acomodação" no formulário, propositalmente — sem isso o hóspede via a
  lista completa de configs antes de saber qual quarto é o dele.

## Fluxo de trabalho

- Clarificar antes de codar. Specs em markdown antes de features novas (pasta docs/ ou specs/ no repo).
- Pedir permissão antes de deploy e de qualquer git push.
- Testar localmente antes de subir para o Workers.

## Docs de referência

- `docs/apps-script-agenda.md` — código completo do `doPost`/Apps Script:
  criação de evento na agenda com cor por quarto, e o e-mail de aviso.
- `docs/apps-script-reservas.md` — leitura dos e-mails do Innotel
  (`suporte@taranis.com.br`) para criar o evento na agenda no momento da
  reserva, antes do formulário; o formulário depois atualiza o mesmo evento.
- `docs/mensagens.md` — arquivo único com TODO o texto de atendimento:
  respostas rápidas do WhatsApp, mensagens automáticas das OTAs, vouchers,
  políticas e conhecimento do bot. Cada mensagem traz o tom Fabio e o tom
  formal quando eles diferem (decisão de qual usar ainda em aberto). Regra
  de negócio do voucher fica em `SHANTI BIG PICTURE/docs/sistema-vouchers.md`.
- `docs/especificacoes.md` — especificação original do app.
