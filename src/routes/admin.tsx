import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShantiLogo } from "@/components/shanti-logo";
import { rooms, type RoomKey } from "@/lib/shanti";

const SENHA = "20shanti22";
// Rota protegida no Worker (src/server.ts) — o token secreto é adicionado no
// servidor, nunca no navegador.
const BUSCA_ENDPOINT = "/api/buscar";
const WHATSAPP_GENILDA = "5562998546284";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Ferramenta Paula — Shanti" }] }),
  component: Paula,
});

function Paula() {
  const [auth, setAuth] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState(false);
  const [quarto, setQuarto] = useState<RoomKey>("caliandra");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [nome, setNome] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [linkGerado, setLinkGerado] = useState("");
  const [genildaEnviado, setGenildaEnviado] = useState(false);
  const [reservaDireta, setReservaDireta] = useState(false);
  const [buscaVazia, setBuscaVazia] = useState(false);
  const [valorPendente, setValorPendente] = useState("");
  const [resultado, setResultado] = useState<{quarto: string; quartoKey: string; checkin: string; checkout: string; plataforma: string; configuracao: string; horario: string} | null>(null);
  const [listaResultados, setListaResultados] = useState<{nome: string; quarto: string; quartoKey: string; checkin: string; checkout: string; plataforma: string; configuracao: string; horario: string}[]>([]);
  const [plataforma, setPlataforma] = useState("");

  function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    if (senha === SENHA) {
      setAuth(true);
    } else {
      setSenhaErro(true);
    }
  }

  async function buscarNome() {
    if (!nome && !checkin) return;
    setBuscando(true);
    setResultado(null);
    setListaResultados([]);
    setBuscaVazia(false);
    let found = false;
    try {
      if (nome) {
        const res = await fetch(`${BUSCA_ENDPOINT}?nome=${encodeURIComponent(nome)}`);
        const data = await res.json();
        if (data.resultados && data.resultados.length > 0) {
          if (data.resultados.length === 1) {
            const r = data.resultados[0];
            if (r.quartoKey) setQuarto(r.quartoKey as any);
            if (r.checkin) setCheckin(r.checkin);
            if (r.checkout) setCheckout(r.checkout);
            setResultado(r);
          } else {
            setListaResultados(data.resultados);
          }
          found = true;
        }
      }
      if (!found && checkin) {
        const res = await fetch(`${BUSCA_ENDPOINT}?checkin=${encodeURIComponent(checkin)}`);
        const data = await res.json();
        if (data.resultados && data.resultados.length > 0) {
          if (data.resultados.length === 1) {
            const r = data.resultados[0];
            if (!nome) setNome(r.nome || "");
            if (r.quartoKey) setQuarto(r.quartoKey as any);
            if (r.checkin) setCheckin(r.checkin);
            if (r.checkout) setCheckout(r.checkout);
            setResultado(r);
          } else {
            setListaResultados(data.resultados);
          }
          found = true;
        }
      }
      if (!found) setBuscaVazia(true);
    } catch {
      setBuscaVazia(true);
    } finally {
      setBuscando(false);
    }
  }

  function gerarLink() {
    const base = "https://tanstack-start-app.shanti-checkin.workers.dev/chegada";
    const params = new URLSearchParams({
      quarto,
      checkin,
      checkout,
      ...(nome ? { nome } : {}),
      ...(reservaDireta ? { reserva: "direta" } : {}),
      ...(reservaDireta && valorPendente ? { valor: valorPendente } : {}),
    });
    const link = `${base}?${params.toString()}`;
    setLinkGerado(link);
    return link;
  }

  function abrirWhatsApp() {
    const link = linkGerado || gerarLink();
    const room = rooms[quarto];
    const msg = `Olá! Aqui estão as informações de acesso para sua estadia na Shanti Pousada.\n\n${nome ? `${nome}, a` : "A"}cesse sua página de chegada pelo link abaixo:\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function abrirCalendar() {
    if (!checkin || !checkout) return;
    const room = rooms[quarto];
    const config = resultado?.configuracao || "";
    const plat = resultado?.plataforma || "";
    const firstName = nome ? nome.split(" ")[0] : null;
    const titleParts = [firstName, room.label, config || null, plat || null].filter(Boolean);
    const title = encodeURIComponent(titleParts.join(" · "));
    const start = checkin.replace(/-/g, "");
    const endDate = new Date(checkout);
    endDate.setDate(endDate.getDate() + 1);
    const end = endDate.toISOString().split("T")[0].replace(/-/g, "");
    const detailsRaw = `Hóspede: ${nome || "—"}\nAcomodação: ${room.label}${config ? `\nConfiguração: ${config}` : ""}${plat ? `\nPlataforma: ${plat}` : ""}${reservaDireta && valorPendente ? `\nPagamento pendente: R$ ${valorPendente}` : ""}`;
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${encodeURIComponent(detailsRaw)}&src=shantipousada%40gmail.com`, "_blank");
  }

  function enviarGenilda() {
    setGenildaEnviado(true);
    const link = linkGerado;
    const room = rooms[quarto];
    const config = resultado?.configuracao || "";
    const plat = resultado?.plataforma || "";
    const firstName = nome ? nome.split(" ")[0] : null;
    const titleParts = [firstName, room.label, config || null, plat || null].filter(Boolean);
    const calTitle = encodeURIComponent(titleParts.join(" · "));
    const start = checkin.replace(/-/g, "");
    const endDate = new Date(checkout);
    endDate.setDate(endDate.getDate() + 1);
    const end = endDate.toISOString().split("T")[0].replace(/-/g, "");
    const calDetailsRaw = `Hóspede: ${nome || "—"}
Acomodação: ${room.label}${config ? `
Configuração: ${config}` : ""}${plat ? `
Plataforma: ${plat}` : ""}`;
    const calLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${start}/${end}&details=${encodeURIComponent(calDetailsRaw)}`;
    const linhasMsg = [
      "Olá! Informações da próxima chegada:",
      "",
      `Hóspede: ${nome || "—"}`,
      `Acomodação: ${room.label}`,
      config ? `Configuração: ${config}` : null,
      plat ? `Plataforma: ${plat}` : null,
      resultado?.horario ? `Horário de chegada: ${resultado.horario}` : null,
      reservaDireta && valorPendente ? `Pagamento pendente na chegada: R$ ${valorPendente}` : null,
      `Check-in: ${checkin}`,
      `Check-out: ${checkout}`,
      link ? `
Link do hóspede:
${link}` : null,
      `\nSalvar no Calendar:\n${calLink}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_GENILDA}?text=${encodeURIComponent(linhasMsg)}`, "_blank");
  }

  if (!auth) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="w-full px-5" style={{ maxWidth: 360 }}>
          <ShantiLogo />
          <form onSubmit={handleSenha} className="mt-4 rounded-lg border border-border bg-card p-6">
            <p className="text-sm text-center text-muted-foreground mb-4">Olá, gerente de reservas da Pousada Shanti</p>
            <div className="text-xs text-muted-foreground mb-4 text-center" style={{ letterSpacing: "2px" }}>ACESSO RESTRITO</div>
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setSenhaErro(false); }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary mb-3"
              autoFocus
            />
            {senhaErro && <p className="text-xs text-destructive mb-3">Senha incorreta.</p>}
            <button type="submit" className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium">
              Entrar
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-10" style={{ maxWidth: 480 }}>
        <ShantiLogo />
        <div className="text-xs text-muted-foreground text-center mb-6" style={{ letterSpacing: "3px" }}>FERRAMENTA DE CHEGADA</div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Check-in</label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => { setCheckin(e.target.value); setNome(""); setLinkGerado(""); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Check-out</label>
              <input
                type="date"
                value={checkout}
                onChange={(e) => { setCheckout(e.target.value); setLinkGerado(""); }}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={buscarNome}
            disabled={(!nome && !checkin) || buscando}
            className="w-full rounded-md border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Buscar hóspede no cadastro"}
          </button>

          {buscaVazia && (
            <p className="text-xs text-destructive">
              Nenhum cadastro encontrado. Verifique o nome ou a data, ou preencha manualmente abaixo.
            </p>
          )}

          {listaResultados.length > 1 && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">{listaResultados.length} cadastros encontrados — selecione:</div>
              {listaResultados.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNome(r.nome || "");
                    if (r.quartoKey) setQuarto(r.quartoKey as any);
                    if (r.checkin) setCheckin(r.checkin);
                    if (r.checkout) setCheckout(r.checkout);
                    setResultado(r);
                    setListaResultados([]);
                  }}
                  className="w-full text-left rounded-md border border-border p-3 text-sm hover:bg-accent transition-colors"
                >
                  <strong>{r.nome}</strong> · {r.quartoKey} · {r.checkin} · {r.plataforma || "—"}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Nome do hóspede</label>
            <input
              type="text"
              placeholder="Cole o nome do WhatsApp ou busque acima"
              value={nome}
              onChange={(e) => { setNome(e.target.value); setResultado(null); }}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {resultado && (
            <div className="rounded-md p-3 text-sm space-y-1" style={{ backgroundColor: "var(--primary-soft)" }}>
              <div><strong>{resultado.quartoKey === "nao-sei" || !resultado.quartoKey ? "Não identificado — verificar na plataforma" : resultado.quarto}</strong></div>
              <div className="text-xs text-muted-foreground">Check-in: {resultado.checkin} · Check-out: {resultado.checkout}</div>
              {resultado.configuracao && <div className="text-xs text-muted-foreground">Configuração: {resultado.configuracao}</div>}
              {resultado.plataforma && <div className="text-xs text-muted-foreground">Plataforma: {resultado.plataforma}</div>}
            </div>
          )}

          {resultado && (!resultado.quartoKey || resultado.quartoKey === "nao-sei") && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Acomodação não identificada. Verifique na plataforma e selecione abaixo para gerar o link.</p>
              <select
                value={quarto}
                onChange={(e) => setQuarto(e.target.value as RoomKey)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {Object.entries(rooms).map(([key, room]) => (
                  <option key={key} value={key}>{room.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="reservaDireta"
            checked={reservaDireta}
            onChange={(e) => setReservaDireta(e.target.checked)}
          />
          <label htmlFor="reservaDireta" className="text-sm text-muted-foreground">Reserva direta (pagamento pendente na chegada)</label>
        </div>

        {reservaDireta && (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Valor pendente (R$)</label>
            <input
              type="text"
              placeholder="Ex: 450,00"
              value={valorPendente}
              onChange={(e) => setValorPendente(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        )}

        {checkin && checkout && (
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={gerarLink}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
            >
              Gerar link de chegada
            </button>

            {linkGerado && (
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="text-xs text-muted-foreground break-all">{linkGerado}</div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(linkGerado)}
                  className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Copiar link
                </button>
                <button
                  type="button"
                  onClick={abrirWhatsApp}
                  className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
                >
                  Enviar para hóspede no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={enviarGenilda}
                  className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Avisar funcionária(o) no WhatsApp
                </button>
                <button
                  type="button"
                  onClick={abrirCalendar}
                  className="w-full rounded-md border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Salvar no Google Calendar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
