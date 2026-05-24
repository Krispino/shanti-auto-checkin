# Form Cidade/Estado + Logo + Video Unlock Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cidade/Estado required fields to the pre-check-in form, fix the video unlock condition to trigger ≤24h before check-in (no upper bound), and show the Shanti logo at the top of all four pages.

**Architecture:** Three independent changes to the existing TanStack Router/React app. A shared `ShantiLogo` component is created in `src/components/` and imported by each page. No new routes, no new state management.

**Tech Stack:** React 19, TypeScript, TanStack Router, Tailwind CSS v4, Vite, Bun

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/components/shanti-logo.tsx` | Shared logo component |
| Modify | `src/routes/index.tsx` | Add logo |
| Modify | `src/routes/cadastro.tsx` | Add logo + Cidade/Estado fields |
| Modify | `src/routes/chegada.tsx` | Add logo + fix unlock logic |
| Modify | `src/routes/confirmado.tsx` | Add logo |

---

## Task 1: Create ShantiLogo component

**Files:**
- Create: `src/components/shanti-logo.tsx`

- [ ] **Step 1: Create the component**

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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run build
```

Expected: build succeeds (or fails only on pre-existing issues, not on this new file).

- [ ] **Step 3: Commit**

```bash
git add src/components/shanti-logo.tsx
git commit -m "feat: add ShantiLogo shared component"
```

---

## Task 2: Add logo to index.tsx

**Files:**
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Import the component**

In `src/routes/index.tsx`, add the import after the existing imports:

```tsx
import { ShantiLogo } from "@/components/shanti-logo";
```

- [ ] **Step 2: Insert logo at top of content div**

In the `Index` function, inside `<div className="mx-auto max-w-3xl px-5 py-16 md:py-24">`, add `<ShantiLogo />` as the first child, before `<div className="text-center">`:

```tsx
<div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
  <ShantiLogo />
  <div className="text-center">
    {/* existing content unchanged */}
```

- [ ] **Step 3: Verify build**

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx
git commit -m "feat: add logo to index page"
```

---

## Task 3: Fix video unlock logic in chegada.tsx

**Files:**
- Modify: `src/routes/chegada.tsx:17-23`

- [ ] **Step 1: Replace getStatus function**

Current code at lines 17–23 of `src/routes/chegada.tsx`:

```ts
function getStatus(reserva: ReservaParams): "bloqueado" | "liberado" {
  const now = Date.now();
  const liberaEm = reserva.checkin.getTime() - 24 * 60 * 60 * 1000;
  const checkoutMs = reserva.checkout.getTime();
  if (now >= liberaEm && now <= checkoutMs) return "liberado";
  return "bloqueado";
}
```

Replace with:

```ts
function getStatus(reserva: ReservaParams): "bloqueado" | "liberado" {
  const now = Date.now();
  const liberaEm = reserva.checkin.getTime() - 24 * 60 * 60 * 1000;
  return now >= liberaEm ? "liberado" : "bloqueado";
}
```

- [ ] **Step 2: Verify build**

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/chegada.tsx
git commit -m "fix: unlock video/codes for check-in today or past (remove checkout upper bound)"
```

---

## Task 4: Add logo to chegada.tsx

**Files:**
- Modify: `src/routes/chegada.tsx`

- [ ] **Step 1: Import the component**

Add after the existing imports in `src/routes/chegada.tsx`:

```tsx
import { ShantiLogo } from "@/components/shanti-logo";
```

- [ ] **Step 2: Insert logo at top of content div**

In the `Chegada` function, inside `<div className="mx-auto px-5 py-10 md:py-14" style={{ maxWidth: 760 }}>`, add `<ShantiLogo />` as the first child, before `{/* Header card */}`:

```tsx
<div className="mx-auto px-5 py-10 md:py-14" style={{ maxWidth: 760 }}>
  <ShantiLogo />
  {/* Header card */}
  <div className="rounded-lg border border-border bg-card p-6">
```

- [ ] **Step 3: Verify build**

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/chegada.tsx
git commit -m "feat: add logo to chegada page"
```

---

## Task 5: Add Cidade and Estado fields to cadastro.tsx

**Files:**
- Modify: `src/routes/cadastro.tsx`

- [ ] **Step 1: Add state variables**

After the existing `const [obs, setObs] = useState("")` (around line 38), add:

```tsx
const [cidade, setCidade] = useState("");
const [estado, setEstado] = useState("");
```

- [ ] **Step 2: Add fields to the payload object**

In the `payload` object inside `handleSubmit` (around line 61), add after `email`:

```tsx
cidade,
estado,
```

Full payload with the additions:

```tsx
const payload = {
  nome,
  documento: doc,
  email,
  cidade,
  estado,
  quarto: reserva.room.label,
  quartoKey: reserva.quartoKey,
  checkin: reserva.checkin.toISOString(),
  checkout: reserva.checkout.toISOString(),
  configuracao: config,
  acompanhante,
  horario,
  meio,
  observacao: obs,
  regrasAceitas: regras,
};
```

- [ ] **Step 3: Add Cidade/Estado line to the WhatsApp message**

In the `linhas` array (around line 91), add after the `• Chegada` line:

```tsx
cidade && estado ? `• Cidade/Estado: ${cidade} — ${estado}` : null,
```

Full `linhas` array with the addition:

```tsx
const linhas = [
  `Olá Paula, aqui é ${nome}.`,
  "Acabei de fazer o pré-check-in pelo site da Shanti:",
  "",
  `• Acomodação: ${reserva.room.label}`,
  `• Chegada: ${formatDateShort(reserva.checkin)} — ${horario || "horário a definir"}`,
  cidade && estado ? `• Cidade/Estado: ${cidade} — ${estado}` : null,
  `• Configuração: ${config}`,
  acompanhante ? `• Acompanhante: ${acompanhante}` : null,
  `• Como vou chegar: ${meio || "a definir"}`,
  email ? `• E-mail: ${email}` : null,
  "",
  obs ? `Observação: ${obs}` : null,
  "",
  "Aguardo as instruções de acesso. Obrigada!",
]
  .filter(Boolean)
  .join("\n");
```

- [ ] **Step 4: Add the form fields in the JSX**

In the "Hóspede principal" `<Section>`, after the existing CPF/E-mail grid (around line 163–182), add a new grid for Cidade/Estado:

```tsx
<div className="grid gap-4 md:grid-cols-2">
  <Field label="Cidade" required>
    <input
      type="text"
      required
      placeholder="Sua cidade"
      value={cidade}
      onChange={(e) => setCidade(e.target.value)}
      className={inputCls}
    />
  </Field>
  <Field label="Estado" required>
    <input
      type="text"
      required
      placeholder="UF (ex: GO)"
      maxLength={2}
      value={estado}
      onChange={(e) => setEstado(e.target.value.toUpperCase())}
      className={inputCls}
    />
  </Field>
</div>
```

- [ ] **Step 5: Verify build**

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/routes/cadastro.tsx
git commit -m "feat: add required Cidade and Estado fields to pre-check-in form"
```

---

## Task 6: Add logo to cadastro.tsx

**Files:**
- Modify: `src/routes/cadastro.tsx`

- [ ] **Step 1: Import the component**

Add after the existing imports in `src/routes/cadastro.tsx`:

```tsx
import { ShantiLogo } from "@/components/shanti-logo";
```

- [ ] **Step 2: Insert logo at top of content div**

In the `Cadastro` function, inside `<div className="mx-auto px-5 py-12" style={{ maxWidth: 760 }}>`, add `<ShantiLogo />` as the first child, before the `<div className="text-xs text-muted-foreground" ...>`:

```tsx
<div className="mx-auto px-5 py-12" style={{ maxWidth: 760 }}>
  <ShantiLogo />
  <div
    className="text-xs text-muted-foreground"
    style={{ letterSpacing: "3px" }}
  >
```

- [ ] **Step 3: Verify build**

```bash
bun run build
```

Expected: no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/cadastro.tsx
git commit -m "feat: add logo to cadastro page"
```

---

## Task 7: Add logo to confirmado.tsx

**Files:**
- Modify: `src/routes/confirmado.tsx`

- [ ] **Step 1: Import the component**

Add after the existing imports in `src/routes/confirmado.tsx`:

```tsx
import { ShantiLogo } from "@/components/shanti-logo";
```

- [ ] **Step 2: Insert logo at top of content div**

In the `Confirmado` function, inside `<div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 760 }}>`, add `<ShantiLogo />` as the first child, before `<div className="text-center">`:

```tsx
<div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 760 }}>
  <ShantiLogo />
  <div className="text-center">
```

- [ ] **Step 3: Final build verification**

```bash
bun run build
```

Expected: clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/confirmado.tsx
git commit -m "feat: add logo to confirmado page"
```
