# Criar o evento da reserva no Google Agenda automaticamente

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

// "2026-09-15" -> Date local (evita o deslocamento de fuso do new Date(string))
function dataLocal_(s) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
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
  var fim = dataLocal_(data.checkout);
  if (!inicio || !fim || fim <= inicio) return;

  var cal = CalendarApp.getCalendarById(AGENDA_ID);
  if (!cal) return;

  var nome = String(data.nome || '').trim();
  var titulo = [
    nome || 'Hóspede sem nome',
    String(data.quarto || '').trim() || 'QUARTO A CONFIRMAR',
    String(data.plataforma || '').trim()
  ].filter(String).join(' · ');

  // Se o hóspede reenviar o formulário, atualiza o evento em vez de duplicar.
  if (nome) {
    var doDia = cal.getEventsForDay(inicio);
    for (var i = 0; i < doDia.length; i++) {
      if (doDia[i].getTitle().indexOf(nome) === 0) {
        doDia[i].setTitle(titulo);
        doDia[i].setDescription(descricaoEvento_(data));
        return;
      }
    }
  }

  // Em evento de dia inteiro a data final é exclusiva: passar o check-out puro
  // pinta as noites de fato dormidas, que é como a agenda já vinha sendo usada.
  cal.createAllDayEvent(titulo, inicio, fim).setDescription(descricaoEvento_(data));
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
Mariana Silva · Duplex Seriema · Booking.com
```

Quando o hóspede marca "Não sei / não lembro" na acomodação, o app envia o
quarto vazio e o título sai como `Nome · QUARTO A CONFIRMAR · Plataforma` —
propositalmente chamativo, para aparecer na agenda como pendência.
