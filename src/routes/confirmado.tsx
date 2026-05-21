import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDateShort, getReservaFromSearch } from "@/lib/shanti";
import { ShantiLogo } from "@/components/shanti-logo";

export const Route = createFileRoute("/confirmado")({
  head: () => ({ meta: [{ title: "Pré-check-in confirmado — Shanti Pousada" }] }),
  component: Confirmado,
});

function Confirmado() {
  const [reserva, setReserva] = useState(() =>
    getReservaFromSearch(new URLSearchParams()),
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setReserva(getReservaFromSearch(sp));
    setSearch(window.location.search);
  }, []);

  const firstName = reserva.rawNome
    ? reserva.rawNome.split(" ")[0]
    : "hóspede";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 760 }}>
        <ShantiLogo />
        <div className="text-center">
          <div
            className="mx-auto flex items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              backgroundColor: "var(--primary-soft)",
              color: "var(--primary)",
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            ✓
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-medium tracking-tight">
            Tudo certo, {firstName}.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Sua conversa com a Paula foi aberta no WhatsApp. Toque em 'Enviar'
            lá quando quiser — ela responde rápido.
          </p>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div
            className="flex items-center justify-center rounded-md flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              backgroundColor: "var(--primary-soft)",
              color: "var(--primary)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            PDF
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">Informes e regras da Shanti</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Disponível agora — boa leitura para se preparar
            </div>
          </div>
          <a
            href="/arquivos/politicas-shanti.pdf"
            download
            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
          >
            Baixar
          </a>
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium">Sua página de chegada</h3>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Aqui ficam os códigos do quarto, o vídeo de acesso e tudo que você
            vai precisar. Os códigos liberam automaticamente{" "}
            <strong className="text-foreground">
              24h antes do dia {formatDateShort(reserva.checkin)}
            </strong>
            .
          </p>
          <Link
            to="/chegada"
            search={Object.fromEntries(new URLSearchParams(search))}
            className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
          >
            Ver minha página de chegada
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Você pode salvar este link e voltar a qualquer momento.
          </p>
        </div>
      </div>
    </main>
  );
}