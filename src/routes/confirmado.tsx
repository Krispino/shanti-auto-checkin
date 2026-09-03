import { createFileRoute } from "@tanstack/react-router";
import { ShantiLogo } from "@/components/shanti-logo";
import { useEffect, useState } from "react";
import { getReservaFromSearch } from "@/lib/shanti";

export const Route = createFileRoute("/confirmado")({
  head: () => ({
    meta: [
      { title: "Pré-check-in confirmado — Shanti Pousada" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Confirmado,
});

function Confirmado() {
  const [firstName, setFirstName] = useState("hospede");
  const [reservaDireta, setReservaDireta] = useState(false);

  useEffect(() => {
    const nome = sessionStorage.getItem("checkin_nome");
    if (nome) setFirstName(nome.split(" ")[0]);
    const plataforma = sessionStorage.getItem("checkin_plataforma");
    if (plataforma === "Reserva direta") setReservaDireta(true);
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
            Sua conversa com a Shanti foi aberta. Toque em Enviar lá no WhatsApp.
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

        {reservaDireta && (
          <div className="mt-6 rounded-lg border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex items-center justify-center rounded-md flex-shrink-0" style={{ width: 48, height: 48, backgroundColor: "var(--primary-soft)", color: "var(--primary)", fontSize: 11, fontWeight: 700 }}>
              PDF
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">Guia Shanti — exclusivo para reserva direta</div>
              <div className="text-xs text-muted-foreground mt-0.5">Dicas da Chapada só para quem reservou direto com a gente</div>
            </div>
            <a href="https://shantipousada.com.br/guia-hospede.pdf" target="_blank" rel="noreferrer" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:bg-primary-hover transition-colors">
              Baixar
            </a>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-border bg-card p-6">
          <div className="text-xs text-muted-foreground mb-2" style={{ letterSpacing: "2px" }}>ACESSO E ORIENTAÇÕES</div>
          <p className="text-sm leading-relaxed">
            Os códigos de entrada e as orientações de acesso serão enviados pelo WhatsApp e ficarão disponíveis no dia anterior à sua chegada.
          </p>
        </div>

        <a
          href="https://shantipousada.com.br/chapada-dos-veadeiros/?utm_source=checkin&utm_medium=confirmado&utm_content=roteiros#roteiros"
          target="_blank"
          rel="noreferrer"
          className="mt-6 block rounded-lg p-6 text-center text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--terracota)" }}
        >
          <div className="text-xs opacity-90" style={{ letterSpacing: "2px" }}>ENQUANTO A VIAGEM NÃO CHEGA</div>
          <div className="mt-1 font-medium">Roteiros para a Chapada dos Veadeiros</div>
          <div className="mt-1 text-sm opacity-90 max-w-md mx-auto">
            Trilhas, cachoeiras e passeios para você já ir montando os seus dias. Ver no site →
          </div>
        </a>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a href="https://www.instagram.com/shantipousada" target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-2 text-center hover:bg-accent transition-colors">
            <img src="/arquivos/instagram.png" alt="Instagram" style={{ width: 32, height: 32 }} />
            <div className="text-xs font-medium">Instagram</div>
            <div className="text-xs text-muted-foreground">Dicas e informações sobre a Chapada</div>
          </a>
          <a href="https://shantipousada.com.br" target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-card p-4 flex flex-col items-center gap-2 text-center hover:bg-accent transition-colors">
            <span style={{ fontSize: 24 }}>🌐</span>
            <div className="text-xs font-medium">Site oficial</div>
            <div className="text-xs text-muted-foreground">Reserve direto com desconto</div>
          </a>
        </div>
      </div>
    </main>
  );
}
