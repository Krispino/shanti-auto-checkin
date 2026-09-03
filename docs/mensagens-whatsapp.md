# Mensagens de atendimento — WhatsApp

Textos prontos para colar. Trocar `[Nome]`, `[Quarto]` e `[link]`.

No WhatsApp Business dá para salvar cada uma em **Configurações → Ferramentas
comerciais → Respostas rápidas**, com o atalho sugerido em cada bloco.

Voz da Shanti: parágrafos curtos, tom de conversa, sem lista de tópicos.

---

## 1a. Abertura — confirmar a reserva `/oi`

Primeiro contato vai **sem link**. Link frio de número desconhecido tem a
mesma cara de golpe, e confirmar antes evita mandar acesso para o número
errado.

> Olá, [Nome], tudo bem? Aqui quem fala é Fábio, da Shanti Pousada.
>
> Você tem uma reserva confirmada com a gente, certo?

---

## Mensagem automática das OTAs

Esta é a que dispara sozinha quando a reserva entra, antes de qualquer conversa
no WhatsApp. Confira se está assim em **todas** as plataformas — Booking,
Airbnb, Expedia, Decolar — e no que a Innotel envia.

> Olá, [Nome], obrigado pela reserva!
>
> Aqui é o Fábio, da Shanti Pousada. Preciso que você faça o seu pré-check-in:
>
> https://checkin.shantipousada.com.br
>
> Ele não é burocracia — é o que destrava a sua entrada. A Shanti funciona com
> auto check-in, sem recepção presencial, e é pelo formulário que eu te mando o
> código do portão e o do cofrinho com a chave do seu quarto. Sem isso você
> chega e fica na porta.
>
> Leva dois minutos. Depois eu te envio a sua página de chegada, com o caminho
> e o vídeo do quarto. Os códigos aparecem nela no dia anterior à sua chegada.
>
> Check-in a partir das 14h · Check-out até meio-dia
>
> Qualquer dúvida, estou à disposição. Boa viagem!

**O que mudou em relação à versão anterior:**

O link era `tanstack-start-app.shanti-checkin.workers.dev`, que além de não ter
cara de link da pousada tem cara de golpe — motivo pelo qual o domínio próprio
foi configurado.

"você receberá os códigos com antecedência" virou "aparecem no dia anterior à
sua chegada". Antecedência é vago e faz o hóspede cobrar antes da hora.

O "obrigada" no feminino ficou de quando a Paula respondia; hoje quem atende é
o Fabio, e a mensagem passa a se identificar por nome — número desconhecido
mandando link é o que mais parece golpe.

---

## 1b. Depois do "sim" — mandar o pré-check-in `/precheckin`

> Ótimo! Então preciso que você faça o pré-check-in:
>
> https://checkin.shantipousada.com.br
>
> Ele é o que destrava o seu acesso. A Shanti não tem recepção — o check-in é
> feito por você mesmo, na hora que chegar — e é pelo formulário que eu te mando
> o código do portão e o do cofrinho com a chave do seu quarto. Sem isso você
> chega e fica na porta.
>
> Leva dois minutos. No fim aparece um botão que abre esta conversa com os seus
> dados prontos: é só tocar em Enviar.
>
> Assim que receber, te mando a sua página de chegada, com o caminho e o vídeo
> do quarto. Os códigos aparecem nela no dia anterior à sua chegada.

*Enquanto o pré-check-in parecer papelada, fica para depois. Dizer que não há
recepção e que sem ele a pessoa fica na porta é o que faz preencher na hora.*

---

## 2. Ele preencheu — enviar a página de chegada `/chegada`

Esta o `/admin` já monta sozinha no botão "Enviar para hóspede no WhatsApp",
com o link certo e o texto ajustado conforme falte mais ou menos de 24 horas.
O texto abaixo é o mesmo, caso precise mandar à mão.

**Faltando mais de um dia:**

> Olá, [Nome]! Recebemos o seu pré-check-in, obrigado. Está tudo anotado aqui.
>
> Esta é a sua página de chegada:
> [link]
>
> Nela você encontra o endereço, o vídeo do caminho até [o Quarto] e as
> orientações da casa. Por segurança, o código do portão e o do cofrinho com a
> chave aparecem nessa mesma página no dia anterior à sua chegada.
>
> Qualquer dúvida até lá, é só chamar por aqui.

**Faltando menos de 24 horas:**

> Olá, [Nome]! Recebemos o seu pré-check-in, obrigado.
>
> Esta é a sua página de chegada:
> [link]
>
> Nela estão o código do portão, o código do cofrinho com a chave [do Quarto] e
> um vídeo curto mostrando o caminho até o quarto. O check-in é a partir das 14h.
>
> Boa viagem, e qualquer coisa é só chamar por aqui.

---

## 3. "Já preenchi e não chegou nada" `/jápreencheu`

Acontece quando o hóspede preenche e não toca em Enviar na conversa que o app
abre. **Antes de responder, confira no `/admin`**: busque pela data de chegada,
sem digitar nome — o nome do documento às vezes é diferente do nome do anúncio.

**Se achou o cadastro:**

> Achei sim, [Nome], está tudo certo por aqui. Obrigado!
>
> Esta é a sua página de chegada:
> [link]
>
> [seguir com o parágrafo do caso 2, conforme a data]

**Se não achou:**

> [Nome], procurei aqui e não localizei o seu cadastro. Deve ter faltado o
> último passo: no fim do formulário aparece um botão que abre esta conversa
> com os seus dados, e é preciso tocar em Enviar.
>
> Pode tentar de novo por aqui? https://checkin.shantipousada.com.br
>
> Se der qualquer erro, me fala que a gente resolve por aqui mesmo.

---

## 4. Chegada de última hora, sem preenchimento `/ultimahora`

Reserva feita em cima da hora não vale insistir no formulário: o que essa
pessoa precisa é entrar.

> Olá, [Nome]! Sua reserva está confirmada, e como sua chegada é logo, vou
> direto ao que importa.
>
> Esta é a sua página de chegada:
> [link]
>
> Nela estão o código do portão, o código do cofrinho com a chave [do Quarto] e
> um vídeo curto mostrando o caminho. O check-in é a partir das 14h.
>
> Quando puder, preenche o pré-check-in com calma, é rapidinho:
> https://checkin.shantipousada.com.br
>
> Boa viagem!

---

## 5. Lembrete de quem não preencheu `/lembrete`

Mandar no dia anterior à chegada. Uma vez só.

> [Nome], sua chegada na Shanti é amanhã.
>
> Ainda não recebi o seu pré-check-in, e ele é o que destrava o seu acesso: como
> não temos recepção, é por ele que eu te mando o código do portão e o da chave
> do quarto. Sem isso você chega e fica na porta.
>
> Dá para resolver agora, leva dois minutos:
> https://checkin.shantipousada.com.br
>
> Se preferir, me manda por aqui mesmo o nome completo e o documento de quem vai
> ficar, que eu preencho daqui.

---

## 6. "Cadê os códigos?" antes das 24 horas `/codigos`

> [Nome], os códigos aparecem na sua página de chegada no dia anterior — é uma
> segurança para todo mundo que se hospeda aqui, para que o código do portão
> não fique circulando com semanas de antecedência.
>
> A página é esta, e pode guardar: [link]
>
> Amanhã, ao abrir, o código do portão e o do cofrinho com a chave já vão estar
> lá, junto com o vídeo do caminho.

---

## 7. Véspera da chegada `/vespera`

Opcional, mas é onde aparecem os pedidos que evitam problema na chegada.

> [Nome], tudo pronto para amanhã por aqui.
>
> Sua página de chegada, com os códigos e o vídeo do caminho: [link]
>
> Duas coisas que ajudam antes de subir para São Jorge: não há caixa eletrônico
> na vila, então vale trazer algum dinheiro, e o último posto de combustível
> fica em Alto Paraíso.
>
> Mais dicas que fazem diferença: https://shantipousada.com.br/chapada-dos-veadeiros/?utm_source=whatsapp&utm_medium=vespera&utm_content=dicas#dicas
>
> Boa estrada, e qualquer coisa me chama.

---

## 8. Já chegou `/chegou`

O "Confirmar minha chegada" da página de chegada abre esta conversa com uma
mensagem pronta, e o hóspede sai da página de chegada ao tocar em Enviar — o
mesmo acontece quando ele avisa "cheguei" solto, sem passar pelo botão. Nos
dois casos a resposta é esta, com os links direto na mensagem: assim ele
recebe o essencial mesmo que não volte para a página depois.

> Que bom que chegou bem, [Nome]! Fica à vontade.
>
> No nosso site tem tudo o que você precisa para começar agora: onde comer em
> São Jorge, roteiros personalizados, infos sobre trilhas e cachoeiras e muito
> mais.
> https://shantipousada.com.br/chapada-dos-veadeiros/?utm_source=whatsapp&utm_medium=chegada&utm_content=dicas#dicas
>
> Qualquer coisa que precisar durante a estadia, quem cuida do dia a dia aqui
> na pousada é a Genilda, nossa funcionária. Fala com ela direto por aqui:
> https://wa.me/5562998546284
>
> Boa estadia!

---

## O que não escrever

Não prometer os códigos "em seguida" quando falta mais de um dia: eles só
aparecem 24 horas antes, e a promessa gera cobrança.

Não pedir avaliação junto com o voucher de retorno, nem na mesma conversa. As
plataformas tratam isso como troca de benefício por avaliação, e o risco é
suspensão do perfil.

Não pedir nota específica. Pedir avaliação pode; pedir "avalie com 10", não.
