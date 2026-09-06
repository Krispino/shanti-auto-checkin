import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShantiLogo } from "@/components/shanti-logo";
import { rooms, type RoomKey } from "@/lib/shanti";

// Rotas protegidas no Worker (src/server.ts): a senha é validada no servidor e
// o token do Sheets nunca chega ao navegador.
const BUSCA_ENDPOINT = "/api/buscar";
const LOGIN_ENDPOINT = "/api/login";
// Mantém a sessão entre visitas: sem isto a senha era pedida a cada abertura do
// link. Fica no navegador do próprio aparelho e é reenviada em cada busca.
const CHAVE_SENHA = "shanti_admin_senha";
const WHATSAPP_GENILDA = "5562998546284";

export const Route = createFileRoute("/admin")({
  head: () => ({
    // Prévia própria: sem a foto da fachada nem o texto de marketing, para o
    // link interno não se confundir com o que vai para o hóspede. E fora dos
    // buscadores — é ferramenta de uso interno.
    meta: [
      { title: "Ferramenta interna — Shanti" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Uso interno da pousada. Acesso restrito." },
      { property: "og:title", content: "Ferramenta interna — Shanti" },
      { property: "og:description", content: "Uso interno da pousada. Acesso restrito." },
      {
        property: "og:image",
        content: "https://checkin.shantipousada.com.br/arquivos/logo.alfa.png",
      },
      {
        name: "twitter:image",
        content: "https://checkin.shantipousada.com.br/arquivos/logo.alfa.png",
      },
    ],
  }),
  component: Admin,
});

function Admin() {
  const [auth, setAuth] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const [senha, setSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState(false);
  const [quarto, setQuarto] = useState<RoomKey | "">("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [nome, setNome] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [linkGerado, setLinkGerado] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [reservaDireta, setReservaDireta] = useState(false);
  const [buscaVazia, setBuscaVazia] = useState(false);
  const [valorPendente, setValorPendente] = useState("");
  const [resultado, setResultado] = useState<{quarto: string; quartoKey: string; checkin: string; checkout: string; plataforma: string; configuracao: string; horario: string} | null>(null);
  const [listaResultados, setListaResultados] = useState<{nome: string; quarto: string; quartoKey: string; checkin: string; checkout: string; plataforma: string; configuracao: string; horario: string}[]>([]);

  // Revalida a senha guardada no servidor — se ela tiver mudado, cai na tela
  // de login em vez de deixar o admin abrir e falhar em cada busca.
  useEffect(() => {
    let ativo = true;
    const salva = typeof window !== "undefined" ? localStorage.getItem(CHAVE_SENHA) : null;
    if (!salva) {
      setVerificandoSessao(false);
      return;
    }
    fetch(LOGIN_ENDPOINT, { headers: { "x-admin-senha": salva } })
      .then((res) => {
        if (!ativo) return;
        if (res.ok) {
          setSenha(salva);
          setAuth(true);
        } else {
          localStorage.removeItem(CHAVE_SENHA);
        }
      })
      .catch(() => {})
      .finally(() => ativo && setVerificandoSessao(false));
    return () => {
      ativo = false;
    };
  }, []);

  function sair() {
    localStorage.removeItem(CHAVE_SENHA);
    setSenha("");
    setAuth(false);
  }

  async function handleSenha(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    try {
      const res = await fetch(LOGIN_ENDPOINT, { headers: { "x-admin-senha": senha } });
      if (res.ok) {
        localStorage.setItem(CHAVE_SENHA, senha);
        setAuth(true);
      } else {
        setSenhaErro(true);
      }
    } catch {
      setSenhaErro(true);
    } finally {
      setEntrando(false);
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
        const res = await fetch(`${BUSCA_ENDPOINT}?nome=${encodeURIComponent(nome)}`, {
          headers: { "x-admin-senha": senha },
        });
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
        const res = await fetch(`${BUSCA_ENDPOINT}?checkin=${encodeURIComponent(checkin)}`, {
          headers: { "x-admin-senha": senha },
        });
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
    if (!quarto) {
      alert("Selecione a acomodação antes de gerar o link.");
      return "";
    }
    const base = "https://checkin.shantipousada.com.br/chegada";
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

  // Link genérico: sem nome nem datas, só a acomodação — pra liberar acesso
  // rápido a quem reservou mas ainda não fez o pré-check-in. A página de
  // chegada trata a ausência de "checkin" na URL como sinal pra já vir
  // liberada, sem contagem regressiva.
  function gerarLinkGenerico(): string {
    if (!quarto) return "";
    return `https://checkin.shantipousada.com.br/chegada?quarto=${quarto}`;
  }

  // Faltam menos de 24h para a chegada? Nesse caso os códigos já aparecem na
  // página, e a mensagem muda de "vai liberar" para "está tudo aí".
  function codigosJaLiberados(): boolean {
    if (!checkin) return false;
    const [a, m, d] = checkin.split("-").map(Number);
    if (!a || !m || !d) return false;
    const entrada = new Date(a, m - 1, d, 14, 0, 0);
    return Date.now() >= entrada.getTime() - 24 * 60 * 60 * 1000;
  }

  // Usada tanto pelo botão de enviar quanto pelo de copiar — as duas vias
  // precisam do texto completo, não só do link puro, e do lembrete de
  // apertar "Confirmar minha chegada" ao chegar, que é o que fecha o
  // processo (libera as dicas e o contato da Genilda pro hóspede).
  function mensagemChegada(): string {
    const link = linkGerado || gerarLink();
    if (!link || !quarto) return "";
    const room = rooms[quarto];
    const primeiroNome = nome ? nome.split(" ")[0] : "";
    const saudacao = primeiroNome ? `Olá, ${primeiroNome}!` : "Olá!";
    const lembreteBotao =
      'Assim que chegar, não esqueça de tocar em "Confirmar minha chegada" na página — é o que fecha o processo e libera as dicas da viagem.';
    return codigosJaLiberados()
      ? [
          `${saudacao} Recebemos o seu pré-check-in, obrigado.`,
          "",
          "Esta é a sua página de chegada:",
          link,
          "",
          `Nela estão o código do portão, o código do cofrinho com a chave ${room.article === "a" ? "da" : "do"} ${room.label} e um vídeo curto mostrando o caminho até o quarto. O check-in é a partir das 14h.`,
          "",
          lembreteBotao,
          "",
          "Boa viagem, e qualquer coisa é só chamar por aqui.",
        ].join("\n")
      : [
          `${saudacao} Recebemos o seu pré-check-in, obrigado. Está tudo anotado aqui.`,
          "",
          "Esta é a sua página de chegada:",
          link,
          "",
          `Nela você encontra o endereço, o vídeo do caminho até ${room.article === "a" ? "a" : "o"} ${room.label} e as orientações da casa. Por segurança, o código do portão e o do cofrinho com a chave aparecem nessa mesma página no dia anterior à sua chegada.`,
          "",
          lembreteBotao,
          "",
          "Qualquer dúvida até lá, é só chamar por aqui.",
        ].join("\n");
  }

  function abrirWhatsApp() {
    const msg = mensagemChegada();
    if (!msg) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function abrirCalendar() {
    if (!checkin || !checkout || !quarto) return;
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
    if (!quarto) return;
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

  if (verificandoSessao) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando...</div>
      </main>
    );
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
            <button
              type="submit"
              disabled={entrando || !senha}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium disabled:opacity-50"
            >
              {entrando ? "Entrando..." : "Entrar"}
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
        <div className="text-xs text-muted-foreground text-center" style={{ letterSpacing: "3px" }}>FERRAMENTA DE CHEGADA</div>
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={sair}
            className="text-xs text-muted-foreground hover:text-destructive underline"
          >
            sair deste aparelho
          </button>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Check-in</label>
              <input
                type="date"
                value={checkin}
                onChange={(e) => { setCheckin(e.target.value); setNome(""); setLinkGerado(""); setQuarto(""); setResultado(null); }}
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

          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">
              Acomodação {!quarto && <span className="text-destructive">— confirme antes de gerar o link</span>}
            </label>
            <select
              value={quarto}
              onChange={(e) => setQuarto(e.target.value as RoomKey)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Selecione a acomodação</option>
              {Object.entries(rooms).map(([key, room]) => (
                <option key={key} value={key}>{room.label}</option>
              ))}
            </select>
          </div>

          {quarto && (
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(gerarLinkGenerico())}
              className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Copiar link genérico ({rooms[quarto].label}) — sem nome/data
            </button>
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
              disabled={!quarto}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              Gerar link de chegada
            </button>

            {linkGerado && (
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="text-xs text-muted-foreground break-all">{linkGerado}</div>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(mensagemChegada() || linkGerado)}
                  className="w-full rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                >
                  Copiar mensagem
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
