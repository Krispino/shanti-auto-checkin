# Mensagens da Shanti — arquivo único

Tudo que é texto pronto de atendimento fica aqui: respostas rápidas do
WhatsApp Business, mensagens automáticas das OTAs, mensagens de voucher e
conhecimento do agente de IA (Innotel). Antes existiam quatro documentos
separados (`mensagens-whatsapp.md`, `mensagens-estadia-e-avaliacao.md`,
`mensagens-situacoes-diversas.md` e o bloco de mensagens do
`SHANTI BIG PICTURE/docs/sistema-vouchers.md`) — foram unidos aqui.

Trocar `[Nome]`, `[Quarto]` e `[link]` antes de enviar. No WhatsApp Business,
salvar cada uma em **Configurações → Ferramentas comerciais → Respostas
rápidas** com o atalho `/...` sugerido.

---

## Sobre o tom — decisão ainda em aberto

Cada mensagem aparece em duas versões quando elas diferem:

- **Tom Fabio (WhatsApp)** — como o Fabio fala de verdade: "ok?" no fim de
  frase, contração escrita ("pra", "tá"), emoji leve (🙏 ✌️ 😉). Firme quando
  precisa (multa, horário), sempre com calor.
- **Tom formal (site / OTA)** — a voz oficial da marca: sem contração escrita
  (sempre "para", "está"), sem emoji, sem "ok?".

A regra vigente (CLAUDE.md global) é: **WhatsApp usa o tom Fabio; site, GMB,
OTAs e mídia social usam o tom formal.** Mas o Fabio ainda não bateu o martelo
sobre usar o tom dele em todas as mensagens de WhatsApp — por isso as duas
versões seguem aqui. Quando decidir, apagar a que não for usada.

Onde só muda pontuação, emoji ou contração, a versão formal não é repetida —
é a mesma frase sem esses três elementos. As duas versões completas só
aparecem quando o texto muda de verdade.

---

# 1. Reserva confirmada (antes de qualquer conversa)

## 1.1 Mensagem automática das OTAs `/reservaOta`

Dispara sozinha quando a reserva entra. Conferir se está assim em **todas** as
plataformas — Booking, Airbnb, Expedia, Decolar — e no que a Innotel envia. É
disparo automático para um número que o hóspede não conhece, então fica mais
neutra: cara de golpe pesa mais aqui. **Versão única, não tem tom Fabio.**

> Olá [Nome], obrigado pela reserva!
>
> Importante: a Shanti Pousada opera com auto check-in — não temos recepção
> presencial. Para que você receba os códigos de acesso, é necessário o
> preenchimento do pré-check-in. Sem isso você chega e fica na porta. Basta
> acessar o link abaixo. É rápido e simples, leva 2 minutinhos:
>
> https://checkin.shantipousada.com.br
>
> Após preencher, aparece o botão "confirmar e abrir whatsapp" que já abre uma
> nova aba diretamente no nosso WhatsApp de atendimento. Finalize o processo
> enviando seus dados para em seguida receber os códigos e orientações de
> chegada.
>
> ⏰ Horário de check-in: 14:00
> Horário de check-out: 12:00 (meio-dia)
>
> Qualquer dúvida, estamos à disposição.

---

## 1.2 Confirmação automática do Booking.com `/reservaBooking`

Texto que o próprio Booking.com dispara pelo Template Scheduler deles — não é
mensagem manual nem conversa. **Versão única.** O bot do Innotel deve saber
que essa mensagem existe, para não repetir a mesma informação de outro jeito.

> Olá, [Nome], reserva confirmada!
>
> Trabalhamos com auto check-in — não há recepção física. Para o pré-check-in
> que libera os códigos de acesso, acesse:
>
> https://checkin.shantipousada.com.br

---

## 1.3 Reserva confirmada — pré-check-in obrigatório (manual) `/reservaConfirmada`

Quando o Fabio confirma a reserva à mão (reserva direta, ou OTA cujo
automático não cobriu).

**Tom Fabio:**

> Reserva confirmada!
>
> A Shanti opera com auto check-in — não tem recepção presencial. O
> pré-check-in é obrigatório pra você receber os códigos de acesso: sem ele
> você chega e fica na porta. É rápido, leva 2 minutinhos:
>
> https://checkin.shantipousada.com.br
>
> No fim do formulário aparece um botão que já abre esta conversa com seus
> dados prontos — é só tocar em Enviar.
>
> Qualquer dúvida, tô à disposição 😉
>
> Fábio

**Tom formal:**

> Reserva confirmada!
>
> A Shanti Pousada funciona com auto check-in — não há recepção presencial.
> O pré-check-in é obrigatório para receber os códigos de acesso: sem ele
> você chega e fica na porta.
>
> Leva dois minutos: https://checkin.shantipousada.com.br
>
> No fim do formulário aparece um botão que abre esta conversa com os seus
> dados prontos — é só tocar em Enviar.
>
> Qualquer dúvida, estamos à disposição.
>
> Fábio

---

## 1.4 Pagamento — 50% de sinal via Pix `/reservaSinal`

Para reserva direta. **O CNPJ e o nome completo ficam só neste doc interno —
nunca em conteúdo público do site ou redes sociais.**

**Tom Fabio:**

> Pra confirmar a reserva, a gente pede o pagamento de 50% do valor total.
>
> Pix (CNPJ):
> 14.984.715/0001-30
> Fábio Crispim de Oliveira
>
> Depois do pagamento, me manda o comprovante por aqui mesmo, ok?
>
> Os outros 50% podem ser pagos em dinheiro, Pix ou cartão de crédito na
> chegada.
>
> Qualquer dúvida, tô à disposição 🙏

**Tom formal:**

> Para confirmar a reserva, solicitamos o pagamento de 50% do valor total.
>
> Pix (CNPJ):
> 14.984.715/0001-30
> Fábio Crispim de Oliveira
>
> Depois do pagamento, envie o comprovante por aqui mesmo.
>
> Os outros 50% podem ser pagos em dinheiro, Pix ou cartão de crédito na
> chegada.
>
> Qualquer dúvida, estamos à disposição.

---

# 2. Primeiro contato e pré-check-in

## 2.1 Abertura — confirmar a reserva `/contatoOi`

Primeiro contato vai **sem link**. Link frio de número desconhecido tem a
mesma cara de golpe, e confirmar antes evita mandar acesso para o número
errado. **Versão única** (as duas versões são iguais).

> Olá, [Nome], tudo bem? Aqui quem fala é Fábio, da Shanti Pousada.
>
> Você tem uma reserva confirmada com a gente, certo?

---

## 2.2 Depois do "sim" — mandar o pré-check-in `/contatoPrecheckin`

**Tom Fabio:**

> Ótimo! Então preciso que você faça o pré-check-in, pode ser?
>
> https://checkin.shantipousada.com.br
>
> É rápido, leva uns 2 minutinhos. Como não temos recepção, é por ele que eu
> te mando o código do portão e o da chave do quarto — sem isso você chega e
> fica na porta, então não esquece, ok?
>
> No fim aparece um botão que já abre esta conversa com seus dados prontos, é
> só tocar em Enviar.
>
> Assim que receber, te mando sua página de chegada, com o caminho e o vídeo
> do quarto 🙏

**Tom formal:**

> Ótimo! Então preciso que você faça o pré-check-in:
>
> https://checkin.shantipousada.com.br
>
> Ele é o que destrava o seu acesso. A Shanti não tem recepção — o check-in é
> feito por você mesmo, na hora que chegar — e é pelo formulário que eu te
> mando o código do portão e o do cofrinho com a chave do seu quarto. Sem isso
> você chega e fica na porta.
>
> Leva dois minutos. No fim aparece um botão que abre esta conversa com os
> seus dados prontos: é só tocar em Enviar.
>
> Assim que receber, te mando a sua página de chegada, com o caminho e o vídeo
> do quarto.

*Enquanto o pré-check-in parecer papelada, fica para depois. Dizer que não há
recepção e que sem ele a pessoa fica na porta é o que faz preencher na hora.*

---

## 2.3 "Já preenchi e não chegou nada" `/contatoAchei` `/contatoNaoachei`

Acontece quando o hóspede preenche e não toca em Enviar na conversa que o app
abre. **Antes de responder, confira no `/admin`:** busque pela data de
chegada, sem digitar nome — o nome do documento às vezes é diferente do nome
do anúncio.

**Se achou o cadastro (tom Fabio):**

> Achei sim, [Nome], está tudo certo por aqui! Obrigado.
>
> Esta é sua página de chegada:
> [link]
>
> [seguir com o parágrafo do item 3.1, conforme a data]

**Se não achou (tom Fabio):**

> [Nome], procurei aqui e não achei seu cadastro. Deve ter faltado o último
> passo: no fim do formulário aparece um botão que abre esta conversa com
> seus dados, e é preciso tocar em Enviar.
>
> Pode tentar de novo por aqui? https://checkin.shantipousada.com.br
>
> Se der qualquer erro, me chama que a gente resolve por aqui mesmo 🙏

**Tom formal** — igual, com "Achei sim, [Nome], está tudo certo por aqui.
Obrigado!" / "não localizei o seu cadastro" / "me fala que a gente resolve por
aqui mesmo." (sem 🙏).

---

## 2.4 Lembrete de quem não preencheu `/contatoLembrete`

Mandar no dia anterior à chegada. Uma vez só.

**Tom Fabio:**

> [Nome], sua chegada na Shanti é amanhã!
>
> Ainda não recebi seu pré-check-in, e ele é o que destrava seu acesso: como
> não temos recepção, é por ele que eu te mando o código do portão e o da
> chave do quarto. Sem isso você chega e fica na porta.
>
> Dá para resolver agora, leva dois minutos:
> https://checkin.shantipousada.com.br
>
> Se preferir, me manda por aqui mesmo o nome completo e o documento de quem
> vai ficar, que eu preencho daqui 🙏

**Tom formal** — igual, "é amanhã." em vez de "é amanhã!" e sem 🙏.

---

# 3. Chegada

## 3.1 Enviar a página de chegada `/chegadaPadrao`

O `/admin` já monta esta mensagem nos botões "Copiar mensagem" e "Enviar para
hóspede no WhatsApp" — os dois geram o mesmo texto, com o link certo e
ajustado conforme falte mais ou menos de 24 horas. O texto abaixo é o mesmo,
caso precise mandar à mão.

### Faltando mais de um dia

**Tom Fabio:**

> Olá, [Nome]! Recebemos seu pré-check-in, obrigado — já está tudo anotado
> aqui.
>
> Esta é sua página de chegada:
> [link]
>
> Nela você encontra o endereço, o vídeo do caminho até [o Quarto] e as
> orientações da casa. Por segurança, o código do portão e o do cofrinho com
> a chave aparecem nessa mesma página no dia anterior à sua chegada.
>
> Assim que chegar, não esquece de tocar em "Confirmar minha chegada" na
> página, ok? É o que fecha o processo e libera as dicas da viagem.
>
> Qualquer dúvida até lá, é só chamar por aqui 🙏

**Tom formal:**

> Olá, [Nome]! Recebemos o seu pré-check-in, obrigado. Está tudo anotado aqui.
>
> Esta é a sua página de chegada:
> [link]
>
> Nela você encontra o endereço, o vídeo do caminho até [o Quarto] e as
> orientações da casa. Por segurança, o código do portão e o do cofrinho com
> a chave aparecem nessa mesma página no dia anterior à sua chegada.
>
> Assim que chegar, não esqueça de tocar em "Confirmar minha chegada" na
> página — é o que fecha o processo e libera as dicas da viagem.
>
> Qualquer dúvida até lá, é só chamar por aqui.

### Faltando menos de 24 horas

**Tom Fabio:**

> Olá, [Nome]! Recebemos seu pré-check-in, obrigado.
>
> Esta é sua página de chegada:
> [link]
>
> Nela estão o código do portão, o código do cofrinho com a chave [do Quarto]
> e um vídeo curto mostrando o caminho até o quarto. O check-in é a partir
> das 14h.
>
> Assim que chegar, não esquece de tocar em "Confirmar minha chegada" na
> página, ok? É o que fecha o processo e libera as dicas da viagem.
>
> Boa viagem, e qualquer coisa é só chamar por aqui ✌️

**Tom formal:**

> Olá, [Nome]! Recebemos o seu pré-check-in, obrigado.
>
> Esta é a sua página de chegada:
> [link]
>
> Nela estão o código do portão, o código do cofrinho com a chave [do Quarto]
> e um vídeo curto mostrando o caminho até o quarto. O check-in é a partir
> das 14h.
>
> Assim que chegar, não esqueça de tocar em "Confirmar minha chegada" na
> página — é o que fecha o processo e libera as dicas da viagem.
>
> Boa viagem, e qualquer coisa é só chamar por aqui.

---

## 3.2 Chegada de última hora, sem preenchimento `/chegadaUltimahora`

Reserva feita em cima da hora não vale insistir no formulário: o que essa
pessoa precisa é entrar.

**Tom Fabio:**

> Olá, [Nome]! Sua reserva está confirmada, e como sua chegada é logo, vou
> direto ao que importa.
>
> Esta é sua página de chegada:
> [link]
>
> Nela estão o código do portão, o código do cofrinho com a chave [do Quarto]
> e um vídeo curto mostrando o caminho. O check-in é a partir das 14h.
>
> Quando puder, preenche o pré-check-in com calma, é rapidinho:
> https://checkin.shantipousada.com.br
>
> Boa viagem! ✌️

**Tom formal** — igual, sem ✌️ e "preencha" em vez de "preenche".

---

## 3.3 "Cadê os códigos?" antes das 24 horas `/chegadaCodigos`

**Tom Fabio:**

> [Nome], os códigos aparecem na sua página de chegada no dia anterior — é
> uma segurança para todo mundo que se hospeda aqui, pra que o código do
> portão não fique circulando com semanas de antecedência, ok?
>
> A página é esta, e pode guardar: [link]
>
> Amanhã, ao abrir, o código do portão e o do cofrinho com a chave já vão
> estar lá, junto com o vídeo do caminho.

**Tom formal** — igual, sem "ok?" e "para que" em vez de "pra que".

---

## 3.4 Véspera da chegada `/chegadaVespera`

Opcional, mas é onde aparecem os pedidos que evitam problema na chegada.

**Tom Fabio:**

> [Nome], tudo pronto para amanhã por aqui!
>
> Sua página de chegada, com os códigos e o vídeo do caminho: [link]
>
> Duas coisas que ajudam antes de subir para São Jorge: não há caixa
> eletrônico na vila, então vale trazer algum dinheiro, e o último posto de
> combustível fica em Alto Paraíso.
>
> Mais dicas que fazem diferença: https://checkin.shantipousada.com.br/dicas?v=3
>
> Boa estrada, e qualquer coisa me chama 🙏

**Tom formal** — igual, "tudo pronto para amanhã por aqui." e sem 🙏.

---

## 3.5 Já chegou, mas não apertou o botão `/chegadaAindanaochegou`

Mandar quando o Fabio já sabe que o hóspede chegou (viu, a Genilda avisou)
mas ele não apertou "Confirmar minha chegada" nem mandou "cheguei" por conta
própria. É a única mensagem que **pede** para apertar o botão — a 3.6 abaixo
só responde depois que ele já avisou de algum jeito.

**Tom Fabio:**

> [Nome], vi que você já chegou na Shanti!
>
> Toca no botão "Confirmar minha chegada" na sua página de chegada — [link]
> — que eu já libero ali os links de onde comer em São Jorge e os melhores
> roteiros pra você aproveitar ✌️

**Tom formal** — igual, "para você aproveitar." e sem ✌️.

*Não mandar de madrugada ou fora do horário comercial — vale esperar a manhã
seguinte.*

---

## 3.6 Já chegou `/chegadaChegou`

O "Confirmar minha chegada" da página de chegada abre esta conversa com uma
mensagem pronta, e o hóspede sai da página ao tocar em Enviar — o mesmo
acontece quando ele avisa "cheguei" solto, sem passar pelo botão. Nos dois
casos a resposta é esta, com os links direto na mensagem: assim ele recebe o
essencial mesmo que não volte para a página depois.

> Que bom que chegou bem! Fica à vontade 😊
>
> Dá uma olhada no nosso site que tem bastante coisa útil pra aproveitar os
> dias por aqui:
>
> 🍽️ Onde comer em São Jorge: https://shantipousada.com.br/chapada-dos-veadeiros/onde-comer-em-sao-jorge/?v=3
> 🗺️ Roteiros: https://shantipousada.com.br/chapada-dos-veadeiros/roteiros/?v=3
> 🏞️ Trilhas e cachoeiras: https://shantipousada.com.br/chapada-dos-veadeiros/trilhas-e-cachoeiras/?v=3
>
> Qualquer coisa que precisar durante a estadia, quem cuida do dia a dia
> aqui é a Genilda, é só chamar ela direto por aqui:
> https://wa.me/5562998546284
>
> Boa estadia! ✌️🙏

*O `?v=3` nos links fura o cache de prévia do WhatsApp. Se o conteúdo dessas
páginas mudar no futuro, subir o número (`?v=4`, `?v=5`...) força o WhatsApp
a buscar a prévia de novo.*

---

## 3.7 Chegada antecipada negada (acomodação ocupada) `/chegadaSemantecipada`

**Tom Fabio:**

> [Nome], infelizmente a acomodação está ocupada e não vai ser possível
> autorizar a chegada antecipada.
>
> Mas é possível deixar as malas em um local seguro e utilizar o banheiro
> externo enquanto o quarto não fica pronto. Quando liberar, nossa
> funcionária coloca as malas na acomodação, ok?

**Tom formal:**

> [Nome], infelizmente a acomodação está ocupada e não será possível
> autorizar a chegada antecipada.
>
> É possível deixar as malas em um local seguro e utilizar o banheiro
> externo enquanto o quarto não fica pronto. Quando liberar, nossa
> funcionária coloca as malas na acomodação.

---

## 3.8 Chegada antecipada liberada (sem reserva no dia) `/chegadaAntecipada`

**Tom Fabio:**

> A princípio não tem reserva pra hoje na sua acomodação, então pode chegar
> mais cedo sem problema. Se entrar uma reserva nova, precisamos manter o
> check-in às 14h — mas se isso acontecer, te aviso, ok?

**Tom formal:**

> A princípio não há reserva para hoje na sua acomodação, então pode chegar
> mais cedo sem problema. Se entrar uma reserva nova, precisamos manter o
> check-in às 14h — mas se isso acontecer, avisamos com antecedência.

---

# 4. Durante a estadia

## 4.1 Oferecer suporte + Instagram `/estadiaSuporte`

Instagram é `@shantipousada` (o antigo `espaco_shanti_saojorge` não existe
mais).

**Tom Fabio:**

> Olá, tudo bem por aí? Se precisar de algo, ou quiser dicas, é só chamar
> aqui, ok?
>
> Nosso Instagram também tem várias dicas sobre os passeios da região, se
> quiser seguir a gente: @shantipousada

**Tom formal:**

> Olá, tudo bem por aí? Se precisar de algo, ou quiser dicas, é só chamar
> por aqui.
>
> Nosso Instagram também tem várias dicas sobre os passeios da região:
> @shantipousada

---

## 4.2 Aviso de silêncio — para todos os hóspedes `/estadiaSilencio`

**Tom Fabio:**

> Olá, boa noite, tudo bem? Estamos mandando essa mensagem para todos que
> estão hospedados no momento. Gostaríamos de pedir atenção ao nosso horário
> de silêncio, que vai das 22h às 8h. Entendemos que às vezes é difícil
> segurar a empolgação, principalmente na primeira noite e quando se está em
> grupo, com amigos — mas acreditamos ser possível falar baixo em respeito
> aos vizinhos.
>
> Importante notar que o silêncio precisa acontecer também pela manhã, caso
> acordem antes das 8h.
>
> Obrigado pela atenção 🙏

**Tom formal:**

> Olá, boa noite. Estamos mandando essa mensagem para todos que estão
> hospedados no momento. Só um lembrete sobre nosso horário de silêncio, das
> 22h às 8h. Sabemos que segurar a empolgação é difícil às vezes,
> principalmente na primeira noite e em grupo — mas pedimos que falem baixo
> em respeito aos vizinhos.
>
> O silêncio vale também pela manhã, caso alguém acorde antes das 8h.
>
> Obrigado pela atenção.

---

## 4.3 Limpeza da cozinha coletiva — para todos os hóspedes `/estadiaCozinha`

**Tom Fabio:**

> Olá, estamos mandando essa mensagem para todos que estão hospedados. Como
> em qualquer cozinha compartilhada, pedimos encarecidamente que lavem as
> louças que usarem e tentem manter a ordem o máximo possível. Fazemos a
> parte da manutenção mas nossa equipe não é responsável pela lavagem das
> louças, ok?
>
> Obrigado pela atenção 🙏

**Tom formal:**

> Olá, estamos mandando essa mensagem para todos que estão hospedados. Como
> em qualquer cozinha compartilhada, pedimos que lavem o que usarem e
> mantenham a ordem. Nossa equipe cuida da manutenção, mas não é responsável
> pela louça de hóspede.
>
> Obrigado pela atenção.

---

## 4.4 Cozinha coletiva — argumento para reserva direta em grupo `/estadiaCozinhagrupo`

**Tom Fabio:**

> A cozinha coletiva do refeitório fica aberta das 7h30 às 20h pra uso dos
> hóspedes. Principalmente quando se está entre amigos, em grupo, uma
> cozinha compartilhada sempre rende bons momentos 😉

---

## 4.5 Problema na acomodação — oferta de troca `/estadiaProblema`

**Tom Fabio:**

> [Nome], o motivo do meu contato é que estamos com um problema na
> acomodação que você reservou: um vazamento no banheiro. O diagnóstico é
> que vamos precisar quebrar o piso, então não temos certeza se vai estar
> pronto até sua chegada.
>
> Com isso, gostaria de te oferecer outra acomodação: o Chalé Mantra. O
> valor da diária é o mesmo, então não há necessidade de alterar a reserva.
> Posso te mandar as fotos?
>
> Se não for do seu agrado, a outra opção é o cancelamento. Se conseguirmos
> resolver a situação, não vamos precisar da mudança — mas o mais provável
> é que haja mesmo essa necessidade.

---

# 5. Checkout

## 5.1 Manhã do checkout `/checkoutManha`

Mandar cedo (por volta das 8h) no dia da saída — antecipa a saída em vez de
cobrar na hora.

**Tom Fabio:**

> Bom dia! Apenas algumas instruções pro seu checkout. O horário é meio-dia
> impreterivelmente, pois precisamos de tempo para preparar a acomodação pros
> próximos hóspedes. Qualquer atraso estará sujeito a multa.
>
> Ao sair, basta deixar a chave na maçaneta da acomodação pelo lado de fora e
> mandar uma mensagem por aqui, ok?
>
> Muito obrigado pela estadia, e se houver alguma sugestão pra melhora dos
> nossos serviços, fique à vontade pra nos mandar o feedback, ok? ✌️🙏

---

# 6. Pós-estadia

## 6.1 Pedido de avaliação (1 dia após o checkout) `/posAvaliacao`

Mandar separado do checkout, não junto — funciona melhor quando o hóspede já
chegou em casa e está tranquilo.

**Tom Fabio:**

> Olá, [Nome]! Espero que a viagem de volta tenha sido tranquila.
>
> Se tiver um momento, uma avaliação no Google ou na plataforma que você
> reservou faz muita diferença pra gente. Qualquer feedback, bom ou ruim, é
> bem-vindo.
>
> Quando quiser voltar à Chapada, é só chamar 🙏
>
> Segue a gente no Instagram pra dicas da região e novidades da Shanti:
> @shantipousada

**Tom formal:**

> Olá, [Nome], espero que a viagem de volta tenha sido tranquila.
>
> Se tiver um momento, uma avaliação no Google ou na plataforma que você
> reservou faz muita diferença para nós. Qualquer feedback, bom ou ruim, é
> bem-vindo.
>
> Quando quiser voltar à Chapada, é só chamar.
>
> Segue a gente no Instagram para dicas da região e novidades da Shanti:
> @shantipousada

*Nunca prometer ou insinuar troca de benefício por avaliação (voucher,
desconto), nem pedir nota específica — as plataformas tratam isso como
violação e o risco é suspensão do perfil. Ver "O que não escrever".*

---

## 6.2 Agradecimento pós-avaliação `/posObrigado`

**Tom Fabio:**

> Muito obrigado! É sempre bom receber quem se identifica com nossa proposta.
> Se tiver um tempinho para deixar uma avaliação, é sempre de grande valor
> pra nós. Forte abraço ✌️🙏

---

## 6.3 Agradecimento pós-estadia + pedido de sugestão `/posSugestao`

Diferente do pedido de avaliação — aqui não se menciona avaliação, só
feedback interno. Usar quando não fizer sentido pedir avaliação pública ainda
(ex.: problema durante a estadia).

**Tom Fabio:**

> Olá, tudo bem? Obrigado por ter se hospedado com a gente. Espero que tenha
> gostado, e se tiver alguma sugestão pra melhorar nosso serviço, fica à
> vontade, ok? 🙏✌️

**Tom formal:**

> Olá, tudo bem? Obrigado por ter se hospedado com a gente. Esperamos que
> tenha gostado — e se tiver alguma sugestão para melhorar nosso serviço,
> fica à vontade para nos mandar.

---

## 6.4 Voucher de retorno

Sistema completo (matemática, regras de blackout, código, planilha,
automação futura) em
[`SHANTI BIG PICTURE/docs/sistema-vouchers.md`](../../SHANTI%20BIG%20PICTURE/docs/sistema-vouchers.md).
Aqui ficam só os textos. Enviar **2 a 3 dias depois** do pedido de avaliação
— nunca junto, senão parece "avalie e ganhe desconto". Sempre por WhatsApp
direto, nunca pela caixa de mensagens do Booking/Airbnb.

Desconto: **10% padrão** para todo hóspede pós-estadia. **12% a 18% variável**
(sortear, não fixar) só para quem publicou avaliação pelo fluxo de pedido —
e o vínculo avaliação↔desconto só pode ser dito por WhatsApp, **nunca em
página, post ou qualquer lugar indexável pelo Google**.

### Envio do voucher — padrão (quem NÃO avaliou) `/voucherPadrao`

**Tom Fabio:**

> Oi, [Nome]! Espero que as lembranças da Chapada ainda estejam frescas 🌄
>
> Queria te convidar a voltar: seu código pessoal **SHANTI-[XX]-[NNN]** dá
> 10% de desconto na sua próxima reserva direta com a gente, valendo por 12
> meses (fora feriado e réveillon).
>
> E tem mais: se você passar esse código pra alguém, essa pessoa também
> ganha o desconto — e assim que ela reservar, você recebe um código novo
> pra usar de novo. Indicar quem você gosta e voltar pra Shanti andam
> juntos.
>
> Guarda esse número, ok? ✌️

**Tom formal:**

> Olá, [Nome]! Esperamos que as lembranças da Chapada ainda estejam frescas.
>
> Queremos te convidar a voltar: seu código pessoal **SHANTI-[XX]-[NNN]** dá
> 10% de desconto na sua próxima reserva direta, válido por 12 meses (exceto
> feriados e réveillon).
>
> E tem mais: se você passar esse código para alguém, essa pessoa também
> ganha o desconto. Assim que ela reservar, você recebe um novo código para
> usar de novo. Indicar quem você gosta e voltar à Shanti caminham juntos.
>
> Guarde esse número.

### Envio do voucher — quem avaliou (12–18%) `/voucherAvaliou`

Só enviar depois de **conferir que a avaliação está publicada**. Nunca
prometer antes.

**Tom Fabio:**

> Oi, [Nome]! Espero que as lembranças da Chapada ainda estejam frescas 🌄
>
> Deixar uma avaliação é garantia de desconto automático com a gente — na
> sua próxima hospedagem ou na de algum amigo que você indicar. Seu código
> pessoal **SHANTI-[XX]-[NNN]** dá **[X]% de desconto** na sua próxima
> reserva direta, valendo por 12 meses (fora feriado e réveillon).
>
> E tem mais: se você passar esse código pra alguém, essa pessoa também
> ganha o desconto, e assim que ela reservar você recebe um código novo.
>
> Guarda esse número, ok? ✌️

**Tom formal:**

> Olá, [Nome]! Esperamos que as lembranças da Chapada ainda estejam frescas.
>
> Deixar uma avaliação é garantia de desconto automático com a gente, na sua
> próxima hospedagem ou na de algum amigo que você indicar. Seu código
> pessoal **SHANTI-[XX]-[NNN]** dá **[X]% de desconto** na sua próxima
> reserva direta, válido por 12 meses (exceto feriados e réveillon).
>
> Se você passar esse código para alguém, essa pessoa também ganha o
> desconto, e assim que ela reservar você recebe um novo código.
>
> Guarde esse número.

### Código usado por indicação — avisar o hóspede original `/voucherUsado`

**Tom Fabio:**

> Oi, [Nome]! Boa notícia: alguém usou seu código pra reservar com a gente.
> Muito obrigado por espalhar a Shanti 🙏
>
> Como agradecimento, aqui vai seu código novo: **SHANTI-[XX]-[NNN+1]**,
> também com 10% de desconto, valendo por 12 meses. Espero te ver de novo
> por aqui ✌️

**Tom formal:**

> Olá, [Nome]! Boa notícia: [nome do indicado, se apropriado] usou seu
> código para reservar com a gente. Muito obrigado por espalhar a Shanti.
>
> Como agradecimento, aqui está seu novo código: **SHANTI-[XX]-[NNN+1]**,
> também com 10% de desconto, válido por 12 meses. Esperamos te ver de novo
> por aqui.

### Régua de reativação sazonal `/voucherLembrete`

3–4x por ano, para hóspedes com voucher não usado. Frequência baixa, tom
sóbrio, nunca mais de 1x por gatilho sazonal. Nunca urgência artificial tipo
"só hoje".

**Tom Fabio:**

> Oi, [Nome]! [gancho sazonal: "as cachoeiras estão cheias" / "julho é época
> de céu limpo pra ver as estrelas" / "faz um tempão que você esteve na
> Shanti, que tal voltar?"]
>
> Seu código **SHANTI-[XX]-[NNN]** ainda tá valendo (10% off). Se quiser
> garantir uma data, é só chamar aqui, ok?

**Tom formal:**

> Olá, [Nome]! [gancho sazonal: "As cachoeiras estão cheias" / "Julho é
> temporada de céu limpo para ver as estrelas" / "Faz [X] que você esteve na
> Shanti, que tal voltar?"]
>
> Seu código **SHANTI-[XX]-[NNN]** ainda está valendo (10% off). Se quiser
> garantir uma data, é só chamar aqui.

---

# 7. Políticas e pedidos pontuais

## 7.1 Early check-in `/politicaEarly`

**Tom Fabio:**

> Olá, [Nome], recebemos seu pedido de check-in antecipado!
>
> Nosso horário padrão é a partir das 14h. Entrada antes disso depende da
> disponibilidade do quarto no dia — te confirmo assim que souber, ok?

**Tom formal:**

> Olá, [Nome], recebemos seu pedido de check-in antecipado.
>
> Nosso horário padrão é a partir das 14h. Entrada antes desse horário
> depende da disponibilidade do quarto no dia — te confirmo assim que souber.

---

## 7.2 Late checkout `/politicaLate`

**Tom Fabio:**

> Olá, [Nome], recebemos seu pedido de late checkout.
>
> Nosso horário padrão de saída é até o meio-dia. Pra estender, os valores
> são, sobre a diária:
>
> Saída até 14h: 25%
> Saída entre 14h e 18h: 50%
> Saída depois das 18h: 100%
>
> Sujeito à disponibilidade. Pra confirmar, é só chamar por aqui 🙏

**Tom formal** — igual, "Para estender" / "Para confirmar" e sem 🙏.

---

## 7.3 Estacionamento `/politicaEstacionamento`

**Versão única.**

> Em São Jorge os estabelecimentos não têm estacionamento interno. Estamos
> localizados numa rua tranquila, de frente pra uma reserva ecológica. É
> possível estacionar ao longo do meio fio, com segurança. Como tudo é
> pertinho, vale ir a pé pro centrinho.

---

## 7.4 Fumantes `/politicaFumo`

**Tom Fabio:**

> Olá, [Nome], todos os quartos e áreas internas da Shanti são para
> não-fumantes. O descumprimento está sujeito a multa.
>
> A área externa do deck é a área permitida pra fumar, ok?

**Tom formal:**

> Olá, [Nome], todos os quartos e áreas internas da Shanti são para
> não-fumantes. O descumprimento está sujeito a multa.
>
> A área externa do deck é a área permitida para fumar.

---

## 7.5 Preferência de cama `/politicaCama`

Só vale para a **Suíte Mangaba** (pode ser casal ou 2 solteiros) e o
**Chalé Maytreia** (pode adicionar uma cama de solteiro extra além da de
casal). A informação de preferência deve estar clara já no formulário de
cadastro — o mais importante é que a Genilda já veja no calendário a
configuração o quanto antes. Esta mensagem só é enviada se o hóspede não
indicou a preferência no cadastro.

**Tom Fabio:**

> Olá, [Nome], vi que você não indicou a configuração de cama no cadastro.
> Pra gente preparar o quarto certinho, preciso saber:
>
> [Se Mangaba:] Prefere cama de casal ou duas camas de solteiro?
> [Se Maytreia:] Além da cama de casal, vai precisar da cama de solteiro
> extra?
>
> Me avisa pra eu já deixar anotado aqui, ok? 🙏

**Tom formal** — igual, "para a gente" / "para eu" e sem "ok? 🙏".

---

## 7.6 Faixa de preço (pergunta genérica de valor) `/politicaPreco`

**Tom formal:**

> O valor varia de acordo com o período da viagem, o tipo de acomodação e o
> número de pessoas. Fora de feriado, a diária vai de R$ 180 a R$ 250.
> Gostaria de conhecer as opções de acomodação?

---

## 7.7 Oferta de upgrade de acomodação `/politicaUpgrade`

Aplica-se apenas às **suítes simples** (Caliandra e Mangaba). Se a reserva
veio por OTA, o upgrade precisa ser feito na própria plataforma — o Fabio não
pode alterar a reserva por conta. Se for reserva direta, o ajuste é feito
direto. Mandar **um dia antes da chegada** e confirmar o valor adicional.

**Tom Fabio:**

> [Nome], vi que sua reserva é na [Suíte Caliandra/Mangaba]. Queria te
> oferecer um upgrade pra um chalé mais confortável — o [Chalé Mantra/
> Maytreia] está disponível pro seu período.
>
> A diferença é de R$ [valor] a mais por diária. Se tiver interesse, me
> avisa que te mando as fotos e a gente acerta por aqui, ok?
>
> [Se OTA:] Só preciso que o ajuste seja feito pela própria [plataforma],
> porque não consigo alterar a reserva daqui.
>
> [Se reserva direta:] Posso ajustar direto por aqui.

**Tom formal:**

> [Nome], vi que sua reserva é na [Suíte Caliandra/Mangaba]. Gostaríamos de
> oferecer um upgrade para um chalé mais confortável — o [Chalé Mantra/
> Maytreia] está disponível para o seu período.
>
> A diferença é de R$ [valor] a mais por diária. Se tiver interesse, posso
> enviar as fotos.
>
> [Se OTA:] O ajuste precisa ser feito pela própria [plataforma], pois não
> é possível alterar a reserva por aqui.
>
> [Se reserva direta:] Posso ajustar direto por aqui.

---

## 7.8 "Ainda tem interesse?" — reativar negociação `/politicaInteresse`

**Tom Fabio:**

> Olá, tudo bem? Ainda tem interesse na reserva? Temos bastante procura, mas
> como já conversamos antes, resolvi confirmar com você primeiro.
>
> Conte com a gente pra negociar, ok? 🙏✌️

---

## 7.9 Sem disponibilidade no período `/politicaLotado`

**Tom Fabio:**

> Olá, já estamos lotados pra esse período. Caso tenha interesse em outra
> data, nos avise, ok?

---

## 7.10 Cancelamento em cima da hora — explicando a política `/politicaCancelamento`

**Tom Fabio:**

> Bom dia, [Nome]. Infelizmente não conseguimos arcar com um cancelamento em
> cima da hora — declinamos várias reservas pra essa acomodação nesse
> período.
>
> Imprevistos acontecem. Mas é exatamente para situações como essa que
> nossa política de cancelamento é determinada — inclusive, é um dos
> motivos que fazem possível nossas tarifas serem mais em conta. Pra você
> entender melhor, é a mesma lógica das tarifas de passagem aérea: a
> regular é mais barata justamente porque não permite alteração, e a flex é
> mais cara mas permite cancelar sem ônus pro cliente.
>
> Sentimos muito pela impossibilidade. Esperamos que numa próxima vez tudo
> dê certo 🙏

**Tom formal:**

> Bom dia, [Nome]. Infelizmente não conseguimos absorver um cancelamento em
> cima da hora — já recusamos outras reservas para essa acomodação nesse
> período.
>
> Imprevistos acontecem, e é exatamente para essas situações que existe
> nossa política de cancelamento. É parte do que permite nossas tarifas
> serem mais em conta — como as tarifas de passagem aérea: a tarifa regular
> é mais barata porque não permite alteração; a flexível é mais cara, mas
> permite cancelar sem custo.
>
> Sentimos muito pela impossibilidade. Esperamos que numa próxima vez dê
> tudo certo.

---

## 7.11 Segurança e localização da Vila `/politicaVila`

**Tom Fabio:**

> Ficar na Vila é uma experiência muito legal. Às vezes em feriados fica
> bem agitada — nossa localização é privilegiada nesse sentido porque nossa
> rua fica sempre tranquila 😉

---

## 7.12 Não aceita pets `/politicaPets`

**Tom Fabio:**

> Olá, [Nome], infelizmente a Shanti não aceita animais de estimação. A
> gente não recomenda trazer pet pra São Jorge de maneira geral porque
> poucos atrativos da região aceitam — acaba limitando bastante os passeios,
> ok?

**Tom formal:**

> Olá, [Nome], infelizmente a Shanti não aceita animais de estimação. Não
> recomendamos trazer pet para São Jorge de maneira geral, pois poucos
> atrativos da região aceitam — acaba limitando bastante os passeios.

---

## 7.13 Indicação — captar quem está procurando hospedagem `/politicaIndicacao`

**Tom Fabio:**

> Olá, tudo bem? Meu nome é Fábio, da Shanti Pousada em São Jorge, Chapada
> dos Veadeiros. Fiquei sabendo que você está procurando hospedagem pra
> região!
>
> A Shanti é uma pousada aconchegante com 6 acomodações, localizada em uma
> rua tranquila a 600m do centrinho, de frente pra reserva ecológica.
> Limpeza é nossa prioridade e o suporte é rápido, direto por aqui pelo
> WhatsApp.
>
> Quer conhecer as opções de quarto? Te mando as fotos e os valores 😉

**Tom formal:**

> Olá, tudo bem? Aqui é Fábio, da Shanti Pousada em São Jorge, Chapada dos
> Veadeiros. Soube que você está procurando hospedagem para a região.
>
> A Shanti é uma pousada aconchegante com 6 acomodações, localizada em uma
> rua tranquila a 600m do centro, de frente para a reserva ecológica.
> Limpeza é nossa prioridade e o suporte é rápido, direto por aqui pelo
> WhatsApp.
>
> Gostaria de conhecer as opções de acomodação?

---

# 8. Apresentação das acomodações (reserva direta)

Mensagens para enviar quando o hóspede pergunta sobre um quarto específico ou
quando se quer apresentar as opções. Cada mensagem traz uma descrição curta e
o link para a página completa no site.

## 8.1 Suíte Caliandra `/quartoCaliandra`

> A Suíte Caliandra é uma suíte térrea simples, ideal pra casais. Tem cama
> de casal, varanda com rede, móveis de apoio, ventilador e frigobar.
> Banheiro privativo com aquecimento solar e elétrico.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/caliandra?v=3

## 8.2 Suíte Mangaba `/quartoMangaba`

> A Suíte Mangaba tem configuração flexível — 1 cama de casal ou 2 de
> solteiro — ideal pra amigas, viajantes solo ou casais que não querem
> dividir a cama. Varanda térrea com rede, móveis de apoio, ventilação e
> banheiro privativo com aquecimento solar e elétrico.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/mangaba?v=3

## 8.3 Duplex Caninde `/quartoCaninde`

> O Duplex Caninde tem dois andares com ar-condicionado, ideal pra casais.
> Em cima, cama de casal e sacada com rede; no térreo, banheiro com
> aquecimento solar e elétrico, varanda com mesa e cozinha de apoio
> privativa.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/caninde?v=3

## 8.4 Duplex Seriema `/quartoSeriema`

> O Duplex Seriema acomoda até 4 pessoas — 1 cama queen + 2 de solteiro —
> em dois andares pensados pra funcionar bem em grupo: no térreo, banheiro
> com mictório, pia externa e lockers pra guardar pertences; em cima, as
> camas e o silêncio. Ideal pra grupos de amigos, famílias ou casais.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/seriema?v=3

## 8.5 Chalé Maytreia `/quartoMaytreia`

> O Chalé Maytreia acomoda até 3 pessoas — cama king + cama auxiliar —
> ideal pra casal, dois amigos ou pequena família. Construído em adobe,
> pensado pra dar a sensação de estar em casa, com ar-condicionado e
> cozinha de apoio privativa.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/maytreia?v=3

## 8.6 Chalé Mantra `/quartoMantra`

> O Chalé Mantra é ideal pra casais, com ar-condicionado e cozinha de
> apoio privativa. Construído em adobe, com a leveza da arquitetura
> orgânica — o essencial pra descansar bem e sair cedo pras trilhas.
>
> Veja as fotos e todos os detalhes aqui:
> https://shantipousada.com.br/acomodacoes/mantra?v=3

---

# 9. O que não escrever

Não prometer os códigos "em seguida" quando falta mais de um dia: eles só
aparecem 24 horas antes, e a promessa gera cobrança.

Não pedir avaliação junto com o voucher de retorno, nem na mesma conversa. As
plataformas tratam isso como troca de benefício por avaliação, e o risco é
suspensão do perfil. Separar os dois pedidos por 2 a 3 dias.

Não pedir nota específica. Pedir avaliação pode; pedir "avalie com 10", não.

Nunca publicar o vínculo avaliação↔desconto maior em página do site, post de
rede social ou qualquer lugar indexável pelo Google. Esse vínculo só pode
existir em conversa de WhatsApp.

---

# 10. Removido — não usar mais

- **Política de aceitar pet.** A Shanti não aceita mais animais — a mensagem
  antiga que explicava a taxa e as regras de pet não se aplica. Ver 7.12 para
  a mensagem atual de recusa.
- **"No dia anterior enviaremos as orientações."** Hoje o pré-check-in vai no
  ato da reserva confirmada, não no dia anterior.
- **Links `tanstack-start-app.shanti-checkin.workers.dev` em mensagem nova.**
  Sempre `checkin.shantipousada.com.br` — o domínio próprio existe justamente
  porque o subdomínio do Workers tem cara de golpe. (Links antigos já
  enviados continuam funcionando.)
- **Marca antiga:** "Espaço Shanti", domínio `espacoshanti.net`, Instagram
  `@espaco_shanti_saojorge`. Hoje é Shanti Pousada, `shantipousada.com.br`,
  `@shantipousada`.
- **Remetente "Paula" / "obrigada" no feminino fixo.** Quem atende hoje é o
  Fabio; a mensagem se identifica pelo nome dele.
