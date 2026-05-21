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
      <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <ShantiLogo />
        <div className="text-center">
          <div
            className="text-xs text-muted-foreground"
            style={{ letterSpacing: "4px" }}
          >
            SHANTI POUSADA
          </div>
          <h1 className="mt-8 text-3xl md:text-4xl font-medium tracking-tight">
            Bem-vindo à Shanti Pousada
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Auto check-in em São Jorge, Chapada dos Veadeiros.
          </p>

          <div className="mt-10 mx-auto flex flex-col gap-3" style={{ maxWidth: 340 }}>
            <Link
              to="/cadastro"
              search={Object.fromEntries(new URLSearchParams(search))}
              className="w-full rounded-md bg-primary px-6 py-3 text-primary-foreground font-medium hover:bg-primary-hover transition-colors"
            >
              Fazer pré-check-in (2 min)
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_PAULA}`}
              target="_blank"
              rel="noreferrer"
              className="w-full rounded-md border border-border bg-card px-6 py-3 text-foreground font-medium hover:bg-accent transition-colors"
            >
              Falar com a Shanti no WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <InfoCard title="Onde fica">
            Rua dos Ipês, lote 1
            <br />
            Vila de São Jorge, Alto Paraíso de Goiás
          </InfoCard>
          <InfoCard title="Como funciona">
            Instruções e senhas enviadas por WhatsApp. Auto check-in (sem recepção)
          </InfoCard>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div
        className="text-xs text-muted-foreground mb-3"
        style={{ letterSpacing: "2px" }}
      >
        {title.toUpperCase()}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
