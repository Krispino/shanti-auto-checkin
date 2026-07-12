# CLAUDE.md — shanti-auto-checkin

App de auto check-in para hóspedes da Shanti Pousada Veadeiros.

## Stack

- TanStack Start + TypeScript
- Deploy: Cloudflare Workers → tanstack-start-app.shanti-checkin.workers.dev
- Repo: Krispino/shanti-auto-checkin
- Captura de dados: Google Sheets via Google Apps Script

## Rotas

- `/` — entrada
- `/cadastro` — formulário do hóspede
- `/confirmado` — confirmação
- `/chegada` — instruções de chegada (códigos de lockbox dos 6 quartos)
- `/admin` — ferramenta interna

## Regras invioláveis

1. O formulário `/cadastro` é UMA página única com scroll. Nunca multi-step.
2. O nome da Paula NUNCA aparece em conteúdo voltado a hóspedes. Links de WhatsApp existem para Paula (reservas) e Genilda (local), mas sem expor o nome da Paula ao hóspede.
3. Toda mudança no código do Google Apps Script exige REPUBLICAR como nova versão. Sem republicar, a mudança não vale. Lembrar o Fabio disso em toda alteração.
4. Códigos de lockbox dos 6 quartos já foram corrigidos uma vez — antes de alterar qualquer código, confirmar com o Fabio o valor atual. Nunca inventar.
5. Vídeos das acomodações foram recomprimidos via ffmpeg — manter o padrão de compressão se novos vídeos entrarem.

## Quartos (mapeamento Booking.com)

- Mangaba = Quarto Deluxe Casal + Varanda
- Caliandra = Quarto Duplo Deluxe com Varanda
- Seriema = Quarto Quádruplo Duplex

## Fluxo de trabalho

- Clarificar antes de codar. Specs em markdown antes de features novas (pasta docs/ ou specs/ no repo).
- Pedir permissão antes de deploy e de qualquer git push.
- Testar localmente antes de subir para o Workers.
