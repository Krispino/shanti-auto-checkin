import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  WHATSAPP_PAULA,
  formatDateShort,
  getReservaFromSearch,
} from "@/lib/shanti";
import { ShantiLogo } from "@/components/shanti-logo";

// Endpoint do Google Apps Script — configurar quando estiver pronto
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyzkbdi8IU7lD3jYk3D9sc8E90YKwGKWiW_-IDGlE2vPY1AczZ5Er4zFc1sHlAw37Vd/exec";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [{ title: "Pré-check-in — Shanti Pousada" }],
  }),
  component: Cadastro,
});

function Cadastro() {
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(() =>
    getReservaFromSearch(new URLSearchParams()),
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setReserva(getReservaFromSearch(sp));
    setSearch(window.location.search);
  }, []);

  const [nome, setNome] = useState("");
  const [doc, setDoc] = useState("");
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState("");
  const [acompanhante, setAcompanhante] = useState("");
  const [horario, setHorario] = useState("");
  const [meio, setMeio] = useState("");
  const [obs, setObs] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [regras, setRegras] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reserva.rawNome) setNome(reserva.rawNome);
    if (reserva.room.configs[0]) setConfig(reserva.room.configs[0]);
  }, [reserva]);

  const ondeUsar = useMemo(
    () => `Quem vai usar ${reserva.room.article} ${reserva.room.label}`,
    [reserva],
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!regras) {
      alert("É necessário aceitar as regras da casa para continuar.");
      return;
    }
    setSubmitting(true);

    try {
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

      // Fire-and-forget: no-cors nunca retorna body legível
      fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});

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

      window.open(`https://wa.me/${WHATSAPP_PAULA}?text=${encodeURIComponent(linhas)}`, "_blank");

      navigate({
        to: "/confirmado",
        search: Object.fromEntries(new URLSearchParams(search)),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-12" style={{ maxWidth: 760 }}>
        <ShantiLogo />
        <div
          className="text-xs text-muted-foreground"
          style={{ letterSpacing: "3px" }}
        >
          SHANTI POUSADA · PRÉ-CHECK-IN
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-medium tracking-tight">
          Conta pra gente sobre sua chegada
        </h1>
        <p className="mt-2 text-muted-foreground">
          Leva 2 minutos. Tudo isso fica registrado para você não precisar
          repetir na chegada.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-lg border border-border bg-card"
          style={{ padding: 36 }}
        >
          {/* progress */}
          <div className="flex gap-1 mb-8">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{
                  backgroundColor: i <= step ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>

          {step === 0 && (
            <Section title="Hóspede principal" last>
              <Field label="Nome completo" required>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CPF ou documento">
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={doc}
                    onChange={(e) => setDoc(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
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
                    minLength={2}
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                    className={inputCls}
                  />
                </Field>
              </div>
            </Section>
          )}

          {step === 1 && (
            <Section title="Acomodação" last>
              <Field label="Configuração">
                <select
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  className={inputCls}
                >
                  {reserva.room.configs.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-muted-foreground">
                  {reserva.room.note}
                </p>
              </Field>
              <Field label="Nome do(s) acompanhante(s)">
                <input
                  type="text"
                  placeholder="Nome completo de quem vem com você"
                  value={acompanhante}
                  onChange={(e) => setAcompanhante(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </Section>
          )}

          {step === 2 && (
            <Section title="Chegada" last>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Horário previsto">
                  <select
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Selecione</option>
                    <option>Entre 14h e 16h</option>
                    <option>Entre 16h e 18h</option>
                    <option>Depois das 18h</option>
                    <option>Não sei ainda</option>
                  </select>
                </Field>
                <Field label="Como vai chegar">
                  <select
                    value={meio}
                    onChange={(e) => setMeio(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Selecione</option>
                    <option>Carro próprio</option>
                    <option>Van/transfer</option>
                    <option>Carona</option>
                  </select>
                </Field>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Antes de fechar" last>
              <Field label="Pedido especial">
                <textarea
                  rows={3}
                  placeholder="Alergia, preferência, qualquer coisa que devemos saber..."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-start gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={regras}
                  onChange={(e) => setRegras(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Li e aceito as regras da casa (silêncio 22h-8h, não-fumantes
                  nas áreas internas, sem festas).
                </span>
              </label>
            </Section>
          )}

          <div className="mt-8 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                Voltar
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-md bg-primary text-primary-foreground font-medium px-6 py-2.5 text-sm hover:bg-primary-hover transition-colors"
              >
                Próximo
              </button>
            ) : (
              <div className="text-center flex-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
                  style={{ padding: "14px 32px" }}
                >
                  {submitting ? "Enviando..." : "Confirmar e abrir WhatsApp"}
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  Vamos abrir o WhatsApp com sua mensagem pronta. Você só precisa
                  tocar em 'Enviar'.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition";

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={last ? "mt-6" : "mt-6 pb-6 border-b border-border"}
    >
      <h2 className="text-sm font-medium mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
        {required && " *"}
      </span>
      {children}
    </label>
  );
}