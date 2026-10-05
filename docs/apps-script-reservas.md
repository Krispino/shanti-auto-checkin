# Apps Script: reserva entra na agenda assim que o e-mail chega

Cole o código abaixo no `Código.gs` (junto com o de `apps-script-agenda.md`),
rode `instalarGatilho` uma vez e **republique como nova versão** (Implementar →
Gerenciar implementações → editar → Nova versão). Sem nova versão a mudança não
vale.

## Por que

A Genilda se baseia na agenda para revisar a limpeza do quarto antes da
chegada. Hoje o evento só nasce quando o hóspede envia o formulário, e muitos
só preenchem na hora do check-in. A reserva precisa estar na agenda desde o
momento em que é feita.

## De onde vem a informação

O Innotel (remetente `suporte@taranis.com.br`, para `shantipousada@gmail.com`)
manda e-mail a cada reserva, em dois formatos:

| Origem | Assunto | Observação |
|---|---|---|
| Reserva direta (motor do Innotel) | `Agente de IA — Nova Reserva — Pendente\|Confirmada — LOCALIZADOR` | datas `dd/mm/aaaa`, hóspede em "Hóspede", quarto em "Tipo de Quarto" |
| Airbnb e Booking.com | `Reservation Update – Airbnb\|Booking.com – REFERÊNCIA / LOCALIZADOR – confirmed\|modified` | datas ISO, hóspede em "Guest Name", quarto em "Room Name" |

Cada reserva costuma gerar dois e-mails idênticos — o evento é identificado
pela referência (tag `reserva` no evento), então o segundo só confirma o
primeiro. Um e-mail `modified` atualiza as datas do mesmo evento. Um status com
"cancel" marca o evento como CANCELADA e deixa cinza; nada é apagado.

## O que o evento mostra

```
Mariana · Suíte Mangaba · Booking.com
```

O evento nasce **sempre cinza**: cinza na agenda quer dizer "reserva feita, o
hóspede ainda não fez o cadastro". Sem configuração de cama (o e-mail não
traz). Quando o hóspede enviar o formulário, o evento é encontrado e
reescrito com o título completo (`Nome · Configuração · Quarto · Plataforma`),
a descrição com os dados do cadastro e **a cor do quarto**. O quarto vindo do
e-mail é mantido se o hóspede marcar "Não sei" (nesse caso o evento fica
colorido pelo quarto do e-mail).

Quarto que o script não reconhece sai como `QUARTO A CONFIRMAR`, com o nome
original do Innotel na descrição.

Reserva direta `Pendente` (aguardando pagamento) **não entra** na agenda. O
evento só nasce com o e-mail `Confirmada`, que o Innotel manda depois do
pagamento.

## Código

```javascript
var ROTULO_PROCESSADOS = 'processados_reservas';
var REMETENTE_INNOTEL = 'suporte@taranis.com.br';

var QUARTOS_EMAIL = [
  { chave: 'caliandra', rotulo: 'Suíte Caliandra', padrao: /caliandra/i },
  { chave: 'mangaba',   rotulo: 'Suíte Mangaba',   padrao: /mangaba/i },
  { chave: 'seriema',   rotulo: 'Duplex Seriema',  padrao: /seriema/i },
  { chave: 'maytreia',  rotulo: 'Chalé Maytreia',  padrao: /mayt?reia|maitreya/i },
  { chave: 'mantra',    rotulo: 'Chalé Mantra',    padrao: /mantra/i },
  { chave: 'caninde',   rotulo: 'Duplex Caninde',  padrao: /canind/i }
];

function instalarGatilho() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sincronizarReservasInnotel') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sincronizarReservasInnotel').timeBased().everyMinutes(5).create();
}

function htmlParaLinhas_(html) {
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(td|th|tr|p|h\d|div|table)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .split('\n')
    .map(function (l) { return l.replace(/\s+/g, ' ').trim(); })
    .filter(String);
}

function campo_(linhas, rotulo) {
  for (var i = 0; i < linhas.length - 1; i++) {
    if (rotulo.test(linhas[i])) return linhas[i + 1];
  }
  return '';
}

function dataIso_(texto) {
  var iso = /(\d{4})-(\d{2})-(\d{2})/.exec(texto);
  if (iso) return iso[0];
  var br = /(\d{2})\/(\d{2})\/(\d{4})/.exec(texto);
  return br ? br[3] + '-' + br[2] + '-' + br[1] : '';
}

function reconhecerQuarto_(textoQuarto) {
  for (var i = 0; i < QUARTOS_EMAIL.length; i++) {
    if (QUARTOS_EMAIL[i].padrao.test(textoQuarto)) return QUARTOS_EMAIL[i];
  }
  return null;
}

function interpretarEmail_(assunto, html) {
  var linhas = htmlParaLinhas_(html);
  var direta = /Nova Reserva\s+[—–-]\s+(Pendente|Confirmada)\s+[—–-]\s+(\S+)/i.exec(assunto);
  var ota = /Reservation Update\s+[—–-]\s+(.+?)\s+[—–-]\s+(\S+)\s*\/\s*(\S+)\s+[—–-]\s+(\w+)/i.exec(assunto);
  var r;

  if (direta) {
    r = {
      referencia: direta[2],
      plataforma: 'Reserva direta',
      status: /pendente/i.test(direta[1]) ? 'pendente' : 'confirmada',
      nome: campo_(linhas, /^h(&oacute;|ó)spede$/i),
      quartoOriginal: campo_(linhas, /^Tipo de Quarto$/i),
      checkin: dataIso_(campo_(linhas, /^Check-in$/i)),
      checkout: dataIso_(campo_(linhas, /^Check-out$/i)),
      adultos: campo_(linhas, /^Adultos$/i)
    };
  } else if (ota) {
    r = {
      referencia: ota[2],
      plataforma: /booking/i.test(ota[1]) ? 'Booking.com' : /airbnb/i.test(ota[1]) ? 'Airbnb' : ota[1],
      status: /cancel/i.test(ota[4]) ? 'cancelada' : /modif/i.test(ota[4]) ? 'modificada' : 'confirmada',
      nome: campo_(linhas, /^Guest Name:?$/i),
      quartoOriginal: campo_(linhas, /^Room Name:?$/i),
      checkin: dataIso_(campo_(linhas, /^Check-in:?$/i)),
      checkout: dataIso_(campo_(linhas, /^Check-out:?$/i)),
      adultos: ''
    };
    var hospedes = /(\d+)\s*Adults?/i.exec(linhas.join('\n'));
    if (hospedes) r.adultos = hospedes[1];
  } else {
    return null;
  }

  if (!r.nome || !r.checkin || !r.checkout) return null;
  r.quarto = reconhecerQuarto_(r.quartoOriginal);
  return r;
}

function acharEventoPorReserva_(cal, referencia) {
  var hoje = new Date();
  var de = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 60);
  var ate = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 540);
  var eventos = cal.getEvents(de, ate);
  for (var i = 0; i < eventos.length; i++) {
    if (eventos[i].getTag('reserva') === referencia) return eventos[i];
  }
  return null;
}

function tituloReserva_(r) {
  return [
    r.nome.split(' ')[0],
    r.quarto ? r.quarto.rotulo : 'QUARTO A CONFIRMAR',
    r.plataforma
  ].join(' · ');
}

function descricaoReserva_(r) {
  var linhas = [
    'Hóspede: ' + r.nome,
    'Acomodação: ' + (r.quarto ? r.quarto.rotulo : 'NÃO RECONHECIDA — conferir no Innotel'),
    'Nome no Innotel: ' + r.quartoOriginal,
    'Plataforma: ' + r.plataforma,
    'Check-in: ' + r.checkin + '  ·  Check-out: ' + r.checkout
  ];
  if (r.adultos) linhas.push('Adultos: ' + r.adultos);
  linhas.push('Referência: ' + r.referencia);
  linhas.push('');
  linhas.push('Configuração de cama: aguardando o cadastro do hóspede');
  linhas.push('Criado pela reserva em ' + new Date().toLocaleString('pt-BR'));
  return linhas.join('\n');
}

function aplicarReserva_(r) {
  var inicio = dataLocal_(r.checkin);
  var checkout = dataLocal_(r.checkout);
  if (!inicio || !checkout || checkout <= inicio) return;
  var fim = new Date(checkout.getFullYear(), checkout.getMonth(), checkout.getDate() + 1);

  var cal = CalendarApp.getCalendarById(AGENDA_ID);
  if (!cal) return;
  var evento = acharEventoPorReserva_(cal, r.referencia);

  if (r.status === 'cancelada') {
    if (evento && evento.getTitle().indexOf('CANCELADA') !== 0) {
      evento.setTitle('CANCELADA · ' + evento.getTitle());
      evento.setColor(CalendarApp.EventColor.GRAY);
    }
    return;
  }

  if (r.status === 'pendente' && !evento) return;

  if (evento) {
    evento.setAllDayDates(inicio, fim);
    if (evento.getTag('origem') === 'email') {
      evento.setTitle(tituloReserva_(r));
      evento.setDescription(descricaoReserva_(r));
    }
    return;
  }

  evento = cal.createAllDayEvent(tituloReserva_(r), inicio, fim);
  evento.setDescription(descricaoReserva_(r));
  evento.setColor(CalendarApp.EventColor.GRAY);
  evento.setTag('reserva', r.referencia);
  evento.setTag('origem', 'email');
  if (r.quarto) evento.setTag('quarto', r.quarto.chave);
}

function sincronizarReservasInnotel() {
  var props = PropertiesService.getScriptProperties();
  var vistos = JSON.parse(props.getProperty('reservas_processadas') || '[]');
  var threads = GmailApp.search('from:' + REMETENTE_INNOTEL + ' newer_than:3d').reverse();

  threads.forEach(function (thread) {
    thread.getMessages().forEach(function (msg) {
      var id = msg.getId();
      if (vistos.indexOf(id) !== -1) return;
      try {
        var r = interpretarEmail_(msg.getSubject(), msg.getBody());
        if (r) aplicarReserva_(r);
        else console.warn('E-mail do Innotel não reconhecido: ' + msg.getSubject());
      } catch (err) {
        console.error('Falha em ' + msg.getSubject() + ': ' + err);
        return;
      }
      vistos.push(id);
    });
  });

  props.setProperty('reservas_processadas', JSON.stringify(vistos.slice(-300)));
}
```

## Mudança em `criarEventoAgenda` (apps-script-agenda.md)

O bloco "Se o hóspede reenviar o formulário…" passa a procurar o evento por
nome **ou**, se o nome não bater (reserva no nome de outra pessoa), por quarto
e data de check-in entre os eventos criados pelo e-mail. Substitua o trecho do
`criarEventoAgenda` a partir de `var quartoInformado` por:

```javascript
function semAcento_(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function acharEventoDoCadastro_(cal, inicio, primeiroNome, quartoKey) {
  var doDia = cal.getEventsForDay(inicio);
  var alvo = semAcento_(primeiroNome);
  if (alvo) {
    for (var i = 0; i < doDia.length; i++) {
      if (semAcento_(doDia[i].getTitle()).indexOf(alvo) === 0) return doDia[i];
    }
  }
  if (quartoKey) {
    for (var j = 0; j < doDia.length; j++) {
      var comecaHoje = doDia[j].getAllDayStartDate().getTime() === inicio.getTime();
      if (comecaHoje && doDia[j].getTag('origem') === 'email' && doDia[j].getTag('quarto') === quartoKey) {
        return doDia[j];
      }
    }
  }
  return null;
}
```

E, no corpo de `criarEventoAgenda`, depois de calcular `primeiroNome`:

```javascript
  var existente = acharEventoDoCadastro_(cal, inicio, primeiroNome, String(data.quartoKey || '').toLowerCase());
  if (existente && !String(data.quarto || '').trim() && existente.getTag('quarto')) {
    data.quartoKey = existente.getTag('quarto');
    var doEmail = reconhecerQuarto_(data.quartoKey);
    data.quarto = doEmail ? doEmail.rotulo : '';
  }
```

O restante (título, cor, descrição) segue como está, e o ramo final troca o
laço antigo por:

```javascript
  if (existente) {
    existente.setTitle(titulo);
    existente.setDescription(descricaoEvento_(data));
    existente.setColor(cor);
    existente.setTag('origem', 'formulario');
    return;
  }
```

`reconhecerQuarto_` aceita a chave (`mangaba`, `caninde`…) porque cada padrão
casa com o próprio nome da chave.

## Na primeira execução

1. Rodar `instalarGatilho` pelo editor e aceitar as permissões — o script
   passa a ler o Gmail, além de Planilha e Agenda.
2. Rodar `sincronizarReservasInnotel` uma vez à mão e conferir a agenda: os
   e-mails dos últimos 3 dias entram de uma vez.
3. Os eventos antigos do Canindé seguem na cor padrão (azul claro); só os
   novos saem em Mirtilo (azul escuro). Se quiser, recolorir os antigos à mão.
4. Conferir nos logs (Execuções) se aparece "E-mail do Innotel não
   reconhecido" — significa formato novo de e-mail.
