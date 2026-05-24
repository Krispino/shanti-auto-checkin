# Design: Cidade/Estado no formulário, logo em todas as páginas, correção do unlock do vídeo

## Escopo

Três mudanças independentes no projeto shanti-auto-checkin.

---

## 1. Campos Cidade e Estado (`src/routes/cadastro.tsx`)

### O que muda
- Dois novos campos obrigatórios: **Cidade** e **Estado**, adicionados à seção "Hóspede principal".
- Exibidos em grid 2 colunas (mesma linha), abaixo dos campos CPF/E-mail existentes.
- Somente o campo "Pedido especial" (`obs`) permanece opcional. Todos os demais, incluindo estes, são `required`.
- Novos campos incluídos no `payload` enviado ao Google Sheets e na mensagem do WhatsApp.

### Estado adicionado
```ts
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("");
```

### Posição no formulário
Seção "Hóspede principal", após a grid CPF/E-mail.

### Payload / WhatsApp
```ts
payload: { ..., cidade, estado }
whatsApp: `• Cidade/Estado: ${cidade} — ${estado}`
```

---

## 2. Correção do unlock do vídeo (`src/routes/chegada.tsx`)

### Problema
`getStatus` usa `now <= checkoutMs`, o que bloqueia códigos e vídeo após o checkout — mesmo que o hóspede queira rever as informações.

### Nova lógica
```ts
function getStatus(reserva: ReservaParams): "bloqueado" | "liberado" {
  const now = Date.now();
  const liberaEm = reserva.checkin.getTime() - 24 * 60 * 60 * 1000;
  return now >= liberaEm ? "liberado" : "bloqueado";
}
```

Remove a restrição superior (`now <= checkoutMs`). O status fica "liberado" para sempre a partir de 24h antes do check-in, incluindo quando o check-in é hoje ou no passado.

---

## 3. Logo em todas as páginas

### Páginas afetadas
`index.tsx`, `cadastro.tsx`, `chegada.tsx`, `confirmado.tsx`

### Abordagem
Componente `<ShantiLogo />` em `src/components/shanti-logo.tsx` (ou inline em `src/lib/shanti.tsx` se o projeto não tiver pasta components).

```tsx
export function ShantiLogo() {
  return (
    <div className="flex justify-center mb-8">
      <img
        src="/arquivos/logooficial1.JPG"
        alt="Shanti Pousada"
        style={{ height: 64, objectFit: "contain" }}
      />
    </div>
  );
}
```

Inserida no topo do `<div className="mx-auto ...">` de cada página, antes de qualquer conteúdo existente.
