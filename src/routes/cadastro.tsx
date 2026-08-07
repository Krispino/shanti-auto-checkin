import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  WHATSAPP_PAULA,
  getReservaFromSearch,
  isRoomKey,
  rooms,
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

const todasConfigs = Array.from(
  new Set(Object.values(rooms).flatMap((room) => room.configs)),
);

function Cadastro() {
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(() =>
    getReservaFromSearch(new URLSearchParams()),
  );
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setReserva(getReservaFromSearch(sp));
  }, []);

  const [nome, setNome] = useState("");
  const [doc, setDoc] = useState("");
  const [email, setEmail] = useState("");
  const [config, setConfig] = useState("");
  const [acompanhantes, setAcompanhantes] = useState<string[]>([]);

  const numAcompanhantes = (() => {
    if (config.startsWith("Solteiro")) return 0;
    if (config.includes("+ 2")) return 3;
    if (config.includes("+ 1")) return 2;
    if (config.startsWith("Casal")) return 1;
    if (config.startsWith("4 sol")) return 3;
    if (config.startsWith("3 sol")) return 2;
    if (config.startsWith("2 sol")) return 1;
    return 0;
  })();
  const [horario, setHorario] = useState("");
  const [dataEntrada, setDataEntrada] = useState("");
  const [dataSaida, setDataSaida] = useState("");
  const [meio, setMeio] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [acomodacaoNome, setAcomodacaoNome] = useState("");
  const [obs, setObs] = useState("");
  const [criancas, setCriancas] = useState<{ idade: string }[]>([]);
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [regras, setRegras] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [duplicado, setDuplicado] = useState<{ checkin: string } | null>(null);
  const [jaConfirmado, setJaConfirmado] = useState(false);

  useEffect(() => {
    if (reserva.rawNome) setNome(reserva.rawNome);
  }, [reserva]);

  const ondeUsar = "Quem vai usar a acomodação";

  // Quarto efetivo: o que o hóspede selecionou no formulário, senão o da URL
  const quartoEfetivoKey = isRoomKey(acomodacaoNome) ? acomodacaoNome : null;
  const quartoEfetivo = quartoEfetivoKey ? rooms[quartoEfetivoKey] : reserva.room;

  // Mantém a configuração escolhida se ainda for válida para o quarto atual;
  // senão, cai para o padrão do quarto (ou de todasConfigs, se "não sei").
  useEffect(() => {
    const configsValidas = acomodacaoNome === "nao-sei" ? todasConfigs : quartoEfetivo.configs;
    setConfig((atual) =>
      atual && configsValidas.includes(atual) ? atual : configsValidas[0] ?? "",
    );
  }, [reserva, quartoEfetivo, acomodacaoNome]);

  function toISODate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  async function jaExisteCadastro(): Promise<boolean> {
    if (!nome || !dataEntrada) return false;
    try {
      const res = await fetch(
        `/api/checar-duplicata?nome=${encodeURIComponent(nome)}&checkin=${encodeURIComponent(dataEntrada)}`,
      );
      const data = await res.json();
      return data.existe === true;
    } catch {
      // se a checagem falhar, não bloqueia o hóspede
      return false;
    }
  }

  async function enviarCadastro() {
    setSubmitting(true);

    try {
      const payloadKey = acomodacaoNome === "nao-sei" ? "" : (quartoEfetivoKey || reserva.quartoKey);
      const payload = {
        nome,
        documento: doc,
        email,
        cidade,
        estado,
        quarto: payloadKey ? rooms[payloadKey as keyof typeof rooms].label : "",
        quartoKey: payloadKey,
        plataforma,
        acomodacaoNome,
        checkin: dataEntrada || toISODate(reserva.checkin),
        checkout: dataSaida || toISODate(reserva.checkout),
        configuracao: config,
        acompanhante: acompanhantes.filter(Boolean).join(", "),
        horario,
        meio,
        observacao: obs,
        criancas: criancas.filter(c => c.idade !== "").map(c => `${c.idade} anos`).join(", ") || null,
        regrasAceitas: regras,
        marketingAceito: marketing,
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
        acomodacaoNome && acomodacaoNome ? `• Acomodação: ${acomodacaoNome === "nao-sei" ? "Não sei / não lembro" : acomodacaoNome}` : null,
        dataEntrada ? `• Data de entrada: ${dataEntrada.split("-").reverse().join("/")}` : null,
        dataSaida ? `• Data de saída: ${dataSaida.split("-").reverse().join("/")}` : null,
        horario ? `• Horário: ${horario}` : null,
        cidade && estado ? `• Cidade/Estado: ${cidade} — ${estado}` : null,
        `• Configuração: ${config}`,
        acompanhantes.filter(Boolean).length > 0 ? `• Acompanhantes: ${acompanhantes.filter(Boolean).join(", ")}` : null,
        criancas.filter(c => c.idade !== "").length > 0 ? `• Crianças: ${criancas.filter(c => c.idade !== "").map((c, i) => `criança ${i+1}: ${c.idade} anos`).join(", ")}` : null,
        plataforma ? `• Reservado via: ${plataforma}` : null,
        `• Como vou chegar: ${meio || "a definir"}`,
        "Aguardo as instruções de acesso. Obrigado(a)!",
      ]
        .filter(Boolean)
        .join("\n");

      window.open(`https://wa.me/${WHATSAPP_PAULA}?text=${encodeURIComponent(linhas)}`, "_blank");

      sessionStorage.setItem("checkin_nome", nome);
      navigate({ to: "/confirmado" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!regras) {
      alert("É necessário aceitar as regras da casa para continuar.");
      return;
    }
    if (dataEntrada && dataSaida && dataSaida <= dataEntrada) {
      alert("A data de saída deve ser depois da data de entrada.");
      return;
    }

    setSubmitting(true);
    const existe = await jaExisteCadastro();
    setSubmitting(false);
    if (existe) {
      setDuplicado({ checkin: dataEntrada });
      return;
    }
    await enviarCadastro();
  }

  function confirmarRefazer() {
    setDuplicado(null);
    enviarCadastro();
  }

  function confirmarJaEstaCerto() {
    setDuplicado(null);
    setJaConfirmado(true);
  }

  if (jaConfirmado) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto px-5 py-12 text-center" style={{ maxWidth: 560 }}>
          <ShantiLogo />
          <div
            className="mx-auto mt-6 flex items-center justify-center rounded-full"
            style={{ width: 72, height: 72, backgroundColor: "var(--primary-soft)", color: "var(--primary)", fontSize: 32, fontWeight: 600 }}
          >
            ✓
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-medium tracking-tight">
            Tudo certo, {nome.split(" ")[0] || "viajante"}.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Seu pré-check-in já está registrado. Você vai receber as
            informações de acesso pelo WhatsApp em breve.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_PAULA}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            Falar com a Shanti no WhatsApp
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-12" style={{ maxWidth: 760 }}>
        <ShantiLogo />
        <div
          className="text-xs text-muted-foreground text-center"
          style={{ letterSpacing: "3px" }}
        >
          SHANTI POUSADA · PRÉ-CHECK-IN
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-medium tracking-tight text-center">
          Conta pra gente sobre sua chegada
        </h1>
        <p className="mt-2 text-muted-foreground text-center">
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
                  backgroundColor:
                    i < 2 ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>

          <Section title="Hóspede principal">
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
              <Field label="CPF ou Passaporte" required>
                <input
                  required
                  type="text"
                  placeholder="CPF ou número do passaporte"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="E-mail" required>
                <input
                  required
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

          <Section title="Datas da estadia">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Data de entrada" required>
                <input
                  type="date"
                  required
                  value={dataEntrada}
                  onChange={(e) => setDataEntrada(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Data de saída" required>
                <input
                  type="date"
                  required
                  min={dataEntrada || undefined}
                  value={dataSaida}
                  onChange={(e) => setDataSaida(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title={ondeUsar}>
            <Field label="Configuração">
              <select
                required
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                className={inputCls}
              >
                <option value="">Selecione</option>
                {(acomodacaoNome === "nao-sei"
                  ? todasConfigs
                  : quartoEfetivo.configs
                ).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

            </Field>
            {numAcompanhantes > 0 && (
              <Field label="Acompanhantes">
                <div className="space-y-2">
                  {Array.from({ length: numAcompanhantes }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Acompanhante ${i + 1}`}
                      value={acompanhantes[i] || ""}
                      onChange={(e) => {
                        const nova = [...acompanhantes];
                        nova[i] = e.target.value;
                        setAcompanhantes(nova);
                      }}
                      className={inputCls}
                    />
                  ))}
                </div>
              </Field>
            )}

            <Field label="Crianças">
              <div className="space-y-2">
                {criancas.map((c, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      max={12}
                      placeholder={`Idade da criança ${i + 1}`}
                      value={c.idade}
                      onChange={(e) => {
                        const nova = [...criancas];
                        nova[i] = { idade: e.target.value };
                        setCriancas(nova);
                      }}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setCriancas(criancas.filter((_, j) => j !== i))}
                      className="text-muted-foreground hover:text-destructive text-sm px-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {criancas.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setCriancas([...criancas, { idade: "" }])}
                    className="text-sm text-primary hover:underline"
                  >
                    + Adicionar criança
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Até 3 crianças. Informe a idade de cada uma.</p>
            </Field>
          </Section>

          <Section title="Reserva">
            <Field label="Onde você reservou" required>
              <select
                required
                value={plataforma}
                onChange={(e) => { setPlataforma(e.target.value); setAcomodacaoNome(""); }}
                className={inputCls}
              >
                <option value="">Selecione</option>
                <option>Reserva direta</option>
                <option>Booking.com</option>
                <option>Airbnb</option>
                <option>Expedia</option>
                <option>Decolar</option>
              </select>
            </Field>
            {plataforma && (
              <Field label="Acomodação" required>
                <select
                  required
                  value={acomodacaoNome}
                  onChange={(e) => setAcomodacaoNome(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Selecione</option>
                  <option value="nao-sei">Não sei / não lembro</option>
                  {plataforma === "Booking.com" ? (
                    <>
                <option value="caliandra">Quarto Duplo Deluxe com Varanda (Caliandra)</option>
                <option value="mangaba">Quarto Deluxe com Cama de Casal ou 2 de Solteiro e Varanda (Mangaba)</option>
                <option value="caninde">Apartamento Duplex (Caninde)</option>
                <option value="seriema">Quarto Quadruplo Duplex (Seriema)</option>
                <option value="maytreia">Quarto Família Deluxe (Maytreia)</option>
                <option value="mantra">Chalé Superior (Mantra)</option>
                    </>
                  ) : (
                    <>
                <option value="caliandra">Suíte Caliandra</option>
                <option value="mangaba">Suíte Mangaba</option>
                <option value="caninde">Duplex Caninde</option>
                <option value="seriema">Duplex Seriema</option>
                <option value="maytreia">Chalé Maytreia</option>
                <option value="mantra">Chalé Mantra</option>
                    </>
                  )}
                </select>
              </Field>
            )}
          </Section>

          <Section title="Chegada">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Horário previsto">
                <select
                  required
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
                  required
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
            <label className="flex items-start gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>
                Quero receber dicas da Chapada dos Veadeiros e novidades da Shanti Pousada.
              </span>
            </label>
          </Section>

          {duplicado ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-6 text-center">
              <div className="font-medium">
                Já encontramos um cadastro seu
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Vimos um pré-check-in de {nome.split(" ")[0] || "você"} com
                chegada em {duplicado.checkin.split("-").reverse().join("/")}.
                Você precisa refazer o cadastro, por exemplo para corrigir
                alguma informação?
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={confirmarJaEstaCerto}
                  className="rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Não, já está tudo certo
                </button>
                <button
                  type="button"
                  onClick={confirmarRefazer}
                  disabled={submitting}
                  className="rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {submitting ? "Enviando..." : "Sim, quero refazer"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="inline-block rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
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
