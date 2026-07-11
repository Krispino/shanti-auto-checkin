# Shanti Auto Check-in — Especificações do Projeto

## Visão Geral

Web app de pré-check-in e auto check-in para a Shanti Pousada Veadeiros.
URL: https://tanstack-start-app.shanti-checkin.workers.dev
Stack: TanStack Start + TypeScript + Cloudflare Workers

## Páginas e Rotas

### / — Landing
- Hero card com foto da fachada
- 3 bullets de confiança
- Botão: Fazer pré-check-in (2 min) → /cadastro
- Botão: Falar com a Shanti no WhatsApp
- Card Como funciona

### /cadastro — Formulário de Pré-check-in
Campos obrigatórios: nome, CPF/passaporte, email, cidade, estado, data entrada, data saída, plataforma, acomodação, configuração, horário, transporte, regras
Campos opcionais: acompanhantes, crianças (máx 3, idade máx 12), pedido especial, aceite marketing

Ao submeter:
1. POST para Google Sheets
2. Salva nome no sessionStorage
3. Abre WhatsApp da Paula com mensagem
4. Redireciona para /confirmado

### /confirmado — Confirmação
- Obrigado(a), [nome] (sessionStorage)
- PDF para download
- Card explicando envio dos códigos
- Links Instagram e site

### /chegada — Página de Chegada
Parâmetros: ?quarto=&checkin=&checkout=&nome=&reserva=
Seções: header, countdown, aviso pagamento (se reserva=direta), códigos, vídeo, confirmar chegada, PDF, estadia, antes de ir, suporte
Regra: libera 24h antes do checkin

### /admin — Ferramenta de Chegada
Senha: 20shanti22
Fluxo: busca hóspede → confirma dados → gera link → envia hóspede + Genilda + Calendar

## Quartos

| Key | Label | Cofrinho |
|-----|-------|----------|
| caliandra | Suíte Caliandra | 1000 |
| mangaba | Suíte Mangaba | 0200 |
| caninde | Duplex Caninde | 0004 |
| seriema | Duplex Seriema | 0030 |
| maytreia | Chalé Maytreia | 0005 |
| mantra | Chalé Mantra | 0006 |

Código do portão: 002

## Integrações

Google Sheets endpoint: https://script.google.com/macros/s/AKfycbyzkbdi8IU7lD3jYk3D9sc8E90YKwGKWiW_-IDGlE2vPY1AczZ5Er4zFc1sHlAw37Vd/exec
- POST: salva cadastro + envia email para Genilda
- GET: busca por nome, data ou quarto+data

Paula WhatsApp: 5521964077224
Genilda WhatsApp: 5562998546284
Calendar: shantipousada@gmail.com

## Fluxos

### Hóspede
1. Recebe link → acessa /cadastro → preenche → envia WA para Paula → /confirmado
2. Recebe link de chegada da Paula → acessa /chegada → vê códigos e vídeo

### Paula
1. Recebe WA do hóspede → acessa /admin
2. Busca nome → confirma dados → gera link → envia hóspede + Genilda

### Genilda
1. Recebe email automático do cadastro
2. Recebe WA da Paula com dados + link do Calendar
3. Salva evento no calendário Shanti Pousada Veadeiros

## Regras de Negócio

- Códigos liberam 24h antes do checkin
- Check-in: a partir das 14h
- Check-out: até 12h — atraso sujeito a multa
- Reserva direta: 50% antecipado + 50% na chegada
- Pagamento: Pix, cartão, dinheiro
- Máx 3 crianças, idade máx 12 anos

## Deploy

~/.bun/bin/bun run build && ~/.bun/bin/bunx wrangler deploy

GitHub: https://github.com/Krispino/shanti-auto-checkin
