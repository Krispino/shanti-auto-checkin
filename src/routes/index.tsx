import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WHATSAPP_PAULA } from "@/lib/shanti";
import { ShantiLogo } from "@/components/shanti-logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shanti Pousada — Pré-check-in" },
      {
        name: "description",
        content:
          "Auto check-in da Shanti Pousada em São Jorge, Chapada dos Veadeiros.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 pt-10" style={{ maxWidth: 420 }}>
        <div className="relative w-full overflow-hidden" style={{ borderRadius: 20, height: 240 }}>
          <img
            src="/arquivos/fachada.jpg"
            alt="Shanti Pousada"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 50%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)",
              borderRadius: 20,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 px-5">
            <div
              className="text-xs text-white/80 mb-1"
              style={{ letterSpacing: "4px" }}
            >
              SHANTI POUSADA · SÃO JORGE
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-white text-center">
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>⚡</span><span>Rápido e simples — leva 2 min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>🔒</span><span>Suas informações protegidas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>✓</span><span>Chegada sem filas</span>
          </div>
        </div>

        <div className="mx-auto flex flex-col gap-3" style={{ maxWidth: 340 }}>
          <Link
            to="/cadastro"
            search={Object.fromEntries(new URLSearchParams(search))}
            className="w-full rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary-hover transition-colors text-center"
          >
            Fazer pré-check-in (2 min)
          </Link>
          <a
            href={"https://wa.me/" + WHATSAPP_PAULA}
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-md border border-border bg-card px-6 py-3 text-foreground font-medium hover:bg-accent transition-colors text-center"
          >
            Falar com a Shanti no WhatsApp
          </a>
        </div>

        <div className="mt-6 text-center">
          <InfoCard title="Como funciona" centered>
            Instruções e senhas enviadas por WhatsApp. Auto check-in sem serviço de recepção presencial.
          </InfoCard>
        </div>


      </div>
    </main>
  );
}

function InfoCard({ title, children, centered }: { title: string; children: React.ReactNode; centered?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6" style={{ textAlign: centered ? "center" : "left" }}>
      <div className="text-xs text-muted-foreground mb-3" style={{ letterSpacing: "2px" }}>
        {title.toUpperCase()}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
