# Apps Script: evento na agenda + aviso de cadastro novo

Cole este código no fim do `Código.gs` do Apps Script e adicione a chamada no
`doPost`, conforme a última seção. **Depois é obrigatório republicar como nova
versão** (Implementar → Gerenciar implementações → editar → Nova versão), senão
a mudança não vale.

## Por que

Até aqui os eventos da agenda eram criados à mão, um a um. Isso produziu
títulos sem padrão ("Fabiane- Maitreya", "Manoela - canindé", "Kailany -
Airbnb"), com grafias que não batem com as do app e três em cada oito sem
dizer o quarto. Qualquer automação futura que leia a agenda erra por causa
disso. Com o evento vindo do formulário, o padrão passa a ser um só.

## Código

```javascript
// ===== Agenda =====
var AGENDA_ID = 'shantipousada@gmail.com';

// Cada acomodação tem sua cor na agenda. Mapeamento levantado dos eventos
// lançados à mão até ago/2026 — o Canindé não tem cor própria, fica na cor
// padrão do calendário.
var CORES_QUARTO = {
  caliandra: CalendarApp.EventColor.RED,        // Tomate
  mangaba:   CalendarApp.EventColor.GREEN,      // Manjericão
  seriema:   CalendarApp.EventColor.ORANGE,     // Tangerina
  maytreia:  CalendarApp.EventColor.YELLOW,     // Banana
  mantra:    CalendarApp.EventColor.MAUVE,      // Uva
  caninde:   null                               // sem cor (padrão)
};

// "2026-09-15" -> Date local (evita o deslocamento de fuso do new Date(string))
function dataLocal_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

// Versão curta da configuração, só para o título do evento na agenda — o
// formulário do hóspede continua mostrando "Casal (2 pessoas)" por extenso.
function configResumida_(config) {
  return config === 'Casal (2 pessoas)' ? 'Casal' : config;
}

function descricaoEvento_(data) {
  var linhas = [
    'Hóspede: ' + (data.nome || '—'),
    'Documento: ' + (data.documento || '—'),
    'E-mail: ' + (data.email || '—'),
    'Acomodação: ' + (data.quarto || 'NÃO INFORMADA — conferir na plataforma'),
    'Configuração: ' + (data.configuracao || '—'),
    'Plataforma: ' + (data.plataforma || '—'),
    'Chegada prevista: ' + (data.horario || '—'),
    'Como chega: ' + (data.meio || '—'),
    'Check-in: ' + (data.checkin || '—') + '  ·  Check-out: ' + (data.checkout || '—')
  ];
  if (data.acompanhante) linhas.push('Acompanhantes: ' + data.acompanhante);
  if (data.criancas) linhas.push('Crianças: ' + data.criancas);
  if (data.cidade || data.estado) {
    linhas.push('Cidade/UF: ' + [data.cidade, data.estado].filter(String).join(' — '));
  }
  if (data.observacao) linhas.push('Pedido especial: ' + data.observacao);
  linhas.push('');
  linhas.push('Criado pelo pré-check-in em ' + new Date().toLocaleString('pt-BR'));
  return linhas.join('\n');
}

function criarEventoAgenda(data) {
  var inicio = dataLocal_(data.checkin);
  var checkout = dataLocal_(data.checkout);
  if (!inicio || !checkout || checkout <= inicio) return;

  // Evento de dia inteiro tem data final EXCLUSIVA no Google Agenda — para o
  // evento aparecer pintado até o dia do check-out (inclusive), a data que se
  // passa pra API precisa ser check-out + 1. Isso é proposital: se o evento de
  // quem sai e o de quem entra pintam o MESMO dia, é sinal visual de que a
  // Genilda precisa limpar o quarto correndo, porque tem gente chegando na
  // hora que outro hóspede está de saída.
  var fim = new Date(checkout.getFullYear(), checkout.getMonth(), checkout.getDate() + 1);

  var cal = CalendarApp.getCalendarById(AGENDA_ID);
  if (!cal) return;

  var nome = String(data.nome || '').trim();
  var primeiroNome = nome.split(' ')[0] || '';
  // No título só o primeiro nome — a agenda é vista em cards pequenos, e o
  // nome completo (que fica na descrição) não cabe nem ajuda ali. Configuração
  // logo em seguida: é a informação que a Genilda mais precisa ao olhar a
  // agenda — casal, solteiro, quantas pessoas — para preparar a cama certa
  // antes da chegada. "Casal (2 pessoas)" vira só "Casal" no título — é óbvio
  // que casal são duas pessoas, e o espaço no card é curto; a contagem
  // completa continua na descrição, para quem abrir o evento.
  var titulo = [
    primeiroNome || 'Hóspede sem nome',
    configResumida_(String(data.configuracao || '').trim()),
    String(data.quarto || '').trim() || 'QUARTO A CONFIRMAR',
    String(data.plataforma || '').trim()
  ].filter(String).join(' · ');

  var cor = CORES_QUARTO[String(data.quartoKey || '').toLowerCase()];

  // Se o hóspede reenviar o formulário, atualiza o evento em vez de duplicar.
  // Casa pelo primeiro nome, que é o que agora abre o título.
  if (primeiroNome) {
    var doDia = cal.getEventsForDay(inicio);
    for (var i = 0; i < doDia.length; i++) {
      if (doDia[i].getTitle().indexOf(primeiroNome) === 0) {
        doDia[i].setTitle(titulo);
        doDia[i].setDescription(descricaoEvento_(data));
        if (cor) doDia[i].setColor(cor);
        return;
      }
    }
  }

  var evento = cal.createAllDayEvent(titulo, inicio, fim);
  evento.setDescription(descricaoEvento_(data));
  if (cor) evento.setColor(cor);
}
```

## Chamada no doPost

Dentro do `doPost`, **depois** do `sheet.appendRow([...])` e antes do `return`:

```javascript
  try {
    criarEventoAgenda(data);
  } catch (err) {
    // A agenda nunca pode derrubar o cadastro: a planilha e o e-mail já foram.
    console.error('Falha ao criar evento na agenda: ' + err);
  }
```

## Na primeira execução

O Google vai pedir autorização nova, porque o script passa a acessar a Agenda
além da planilha. Rodar uma vez pelo editor (função `criarEventoAgenda` com um
objeto de teste, ou simplesmente salvar e enviar um cadastro de teste) e
aceitar a permissão.

## Título resultante

```
Mariana · Casal + 1 solteiro (3 pessoas) · Duplex Seriema · Booking.com
```

Só o primeiro nome — o nome completo fica na descrição do evento, não no
título, que a agenda mostra em cards pequenos. A configuração vem logo em
seguida de propósito: é a primeira coisa que a Genilda vê ao abrir o evento, e
é o que ela precisa saber para montar a cama certa antes da chegada.

Quando a configuração é `Casal (2 pessoas)`, o título mostra só `Casal` — duas
pessoas é óbvio, e sobra espaço pro resto. As outras configurações continuam
por extenso, com a contagem de pessoas: `Casal + 1 solteiro (3 pessoas)`,
`2 solteiros (2 pessoas)`, `Solteiro — uso individual (1 pessoa)`. No
formulário do hóspede (app) não muda nada — sempre por extenso lá.

Quando o hóspede marca "Não sei / não lembro" na acomodação, o app envia o
quarto vazio e o título sai como
`Primeiro nome · Configuração · QUARTO A CONFIRMAR · Plataforma` —
o "QUARTO A CONFIRMAR" propositalmente chamativo, para aparecer na agenda
como pendência.

## Data do evento — até o check-out, não até a véspera

O evento vai pintado na agenda **do dia do check-in até o dia do check-out,
inclusive**. É diferente de como a Innotel mostra a reserva (que para um dia
antes do check-out) e diferente também do padrão manual antigo desta agenda,
que só pintava as noites dormidas.

O motivo é operacional: se o evento de quem está saindo e o de um hóspede
novo entrando pintam o **mesmo dia**, é o sinal visual de que há troca no
mesmo dia naquele quarto — a Genilda precisa limpar correndo, porque tem
gente chegando na saída do outro. Com o padrão antigo (parar um dia antes),
essa sobreposição não aparecia na agenda.

## Cores por acomodação

| Acomodação | Cor na agenda | Constante |
|---|---|---|
| Caliandra | Tomate (vermelho) | `RED` |
| Mangaba | Manjericão (verde) | `GREEN` |
| Seriema | Tangerina (laranja) | `ORANGE` |
| Maytreia | Banana (amarelo) | `YELLOW` |
| Mantra | Uva (roxo) | `MAUVE` |
| Canindé | sem cor (padrão do calendário) | — |

O mapeamento foi levantado dos eventos lançados à mão entre maio e agosto de
2026 e é consistente ao longo de todos eles. Quando o hóspede não informa a
acomodação, o evento fica sem cor — junto com o `QUARTO A CONFIRMAR` no título,
serve de sinal de que falta conferir na plataforma.

---

# Aviso de "já cheguei" por e-mail

## Por que

Na página `/chegada` tem um botão "Confirmar minha chegada". Hoje ele só abre
o WhatsApp com uma mensagem pronta — e o hóspede raramente toca em Enviar lá.
Sem esse toque, ninguém fica sabendo que ele chegou. O app agora chama
`/api/avisar-chegada` no momento do clique (antes de abrir o WhatsApp), que
cai aqui no Apps Script e manda o e-mail. Não depende do hóspede completar
nada no WhatsApp depois.

## Código

Adicionar no `doGet` (o mesmo que já responde `/api/buscar` com o token), como
um novo ramo checado **antes** da lógica de busca — se vier
`?acao=chegada&token=...`, manda o aviso e responde, sem tocar na planilha:

```javascript
function doGet(e) {
  var token = e.parameter.token;
  if (token !== TOKEN_SECRETO) {
    return ContentService.createTextOutput(JSON.stringify({ erro: 'não autorizado' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (e.parameter.acao === 'chegada') {
    avisarChegada_(e.parameter.nome, e.parameter.quarto, e.parameter.plataforma);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ... segue a busca existente (nome/checkin) ...
}

function avisarChegada_(nome, quarto, plataforma) {
  var assunto = 'Chegou: ' + (nome || 'hóspede sem nome') + ' · ' + (quarto || 'quarto não informado');
  var corpo = [
    (nome || 'Hóspede') + ' confirmou a chegada pela página de check-in.',
    'Acomodação: ' + (quarto || '—'),
    'Plataforma: ' + (plataforma || '—'),
    '',
    'Confirmado em ' + new Date().toLocaleString('pt-BR')
  ].join('\n');
  MailApp.sendEmail('shantipousada@gmail.com,genildinhapopozuda@gmail.com', assunto, corpo);
}
```

`TOKEN_SECRETO` é o nome que o script já usa internamente para comparar com o
token que o Worker manda — ajustar para o nome real da variável no seu
`doGet` atual.

---

# Aviso de cadastro novo por e-mail

Este é um problema separado da agenda, mas se resolve na mesma edição.

## Por que

O `doPost` já manda um e-mail a cada cadastro, mas só para
`genildinhapopozuda@gmail.com`. O Fabio só fica sabendo se o hóspede tocar em
Enviar na conversa do WhatsApp que o app abre — e isso falha na prática: em
02/09 dois hóspedes preencheram e nenhum aviso chegou. Um fechou a aba antes de
enviar; a outra caiu na checagem de duplicata, que na época não abria o
WhatsApp.

Enquanto o aviso depender de uma ação do hóspede, vai continuar falhando. O
e-mail sai do servidor e não depende de ninguém.

## O que mudar

Procure no `doPost` a linha:

```javascript
MailApp.sendEmail("genildinhapopozuda@gmail.com", assunto, corpo);
```

E troque por:

```javascript
// Vírgula separa os destinatários. O aviso precisa chegar a quem cuida das
// reservas — não pode depender de o hóspede enviar a mensagem no WhatsApp.
MailApp.sendEmail("shantipousada@gmail.com,genildinhapopozuda@gmail.com", assunto, corpo);
```

Trocar `shantipousada@gmail.com` pelo endereço em que você realmente lê e-mail,
se for outro. Vale deixar a notificação do Gmail ligada no celular para esse
endereço — é o que substitui o WhatsApp como aviso garantido.

---

# Depois de colar tudo

1. Salvar o projeto no editor do Apps Script.
2. **Republicar como nova versão**: Implementar → Gerenciar implementações →
   ícone de editar → Versão: **Nova versão** → Implementar. Sem esse passo,
   nada do que está aqui passa a valer.
3. Na primeira execução o Google pede autorização nova, porque o script passa a
   acessar a Agenda além da planilha. Aceitar.
4. Testar enviando um pré-check-in de teste pelo próprio app e conferir se o
   evento apareceu na agenda, com a cor certa, e se o e-mail chegou.
