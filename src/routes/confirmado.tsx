import { createFileRoute } from "@tanstack/react-router";
import { ShantiLogo } from "@/components/shanti-logo";
import { useEffect, useState } from "react";
import { getReservaFromSearch } from "@/lib/shanti";

export const Route = createFileRoute("/confirmado")({
  head: () => ({ meta: [{ title: "Pre-check-in confirmado - Shanti Pousada" }] }),
  component: Confirmado,
});

function Confirmado() {
  const [firstName, setFirstName] = useState("hospede");

  useEffect(() => {
    const nome = sessionStorage.getItem("checkin_nome");
    if (nome) setFirstName(nome.split(" ")[0]);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 560 }}>
        <ShantiLogo />
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center rounded-full" style={{ width: 72, height: 72, backgroundColor: "var(--primary-soft)", color: "var(--primary)", fontSize: 32, fontWeight: 600 }}>
            ✓
          </div>
          <h1 className="mt-6 text-2xl md:text-3xl font-medium tracking-tight">
            Obrigado(a), {firstName}.
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Sua conversa com a Paula foi aberta. Toque em Enviar lá no WhatsApp.
          </p>
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: "var(--primary-soft)", color: "var(--primary)", fontSize: 11, fontWeight: 700 }}>
            PDF
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium">Informes e regras da Shanti</div>
            <div className="text-xs text-muted-foreground mt-0.5">Disponível agora — boa leitura para se preparar</div>
          </div>
          <a href="/arquivos/politicas-shanti.pdf" download className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
            Baixar
          </a>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="text-xs text-muted-foreground mb-2" style={{ letterSpacing: "2px" }}>ACESSO E ORIENTAÇÕES</div>
          <p className="text-sm leading-relaxed">
            Os códigos de entrada e as orientações de acesso serão enviados pelo WhatsApp e ficarão disponíveis no dia anterior à sua chegada.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href="https://www.instagram.com/shanti_pousada_veadeiros" target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-2 text-center hover:bg-accent transition-colors">
            <img src="/arquivos/instagram.png" alt="Instagram" style={{ width: 32, height: 32 }} />
            <div className="text-xs font-medium">Instagram</div>
            <div className="text-xs text-muted-foreground">Dicas e informações sobre a Chapada</div>
          </a>
          <a href="https://www.espacoshanti.com" target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-2 text-center hover:bg-accent transition-colors">
            <span style={{ fontSize: 24 }}>🌐</span>
            <div className="text-xs font-medium">Site oficial</div>
            <div className="text-xs text-muted-foreground">Reserve direto com desconto</div>
          </a>
        </div>
      </div>
    </main>
  );
}
