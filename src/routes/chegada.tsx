import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CODIGO_PORTAO,
  WHATSAPP_GENILDA,
  WHATSAPP_PAULA,
  formatDateShort,
  getReservaFromSearch,
  type ReservaParams,
} from "@/lib/shanti";
import { ShantiLogo } from "@/components/shanti-logo";

export const Route = createFileRoute("/chegada")({
  head: () => ({ meta: [{ title: "Sua chegada — Shanti Pousada" }] }),
  component: Chegada,
});

function getStatus(reserva: ReservaParams): "bloqueado" | "liberado" {
  const now = Date.now();
  const liberaEm = reserva.checkin.getTime() - 24 * 60 * 60 * 1000;
  return now >= liberaEm ? "liberado" : "bloqueado";
}

function timeRemaining(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const totalMin = Math.floor(ms / 60000);
  const dias = Math.floor(totalMin / (60 * 24));
  const horas = Math.floor((totalMin % (60 * 24)) / 60);
  const minutos = totalMin % 60;
  return { dias, horas, minutos };
}

function Chegada() {
  const [reserva, setReserva] = useState(() =>
    getReservaFromSearch(new URLSearchParams()),
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setReserva(getReservaFromSearch(sp));
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const status = getStatus(reserva);
  const liberado = status === "liberado";
  const firstName = reserva.rawNome
    ? reserva.rawNome.split(" ")[0]
    : "hóspede";

  const liberaEm = new Date(reserva.checkin.getTime() - 24 * 60 * 60 * 1000);
  const remaining = timeRemaining(liberaEm);

  const today = new Date();
  const isToday =
    reserva.checkin.toDateString() === today.toDateString();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const isTomorrow =
    reserva.checkin.toDateString() === tomorrow.toDateString();
  const hojeAmanha = isToday ? "hoje" : isTomorrow ? "amanhã" : "em breve";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-10 md:py-14" style={{ maxWidth: 760 }}>
        <ShantiLogo />
        {/* Header card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div
                className="text-xs text-muted-foreground"
                style={{ letterSpacing: "3px" }}
              >
                SHANTI POUSADA · PÁGINA DE CHEGADA
              </div>
              <h1 className="mt-3 text-2xl font-medium tracking-tight">
                Olá, {firstName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {reserva.room.label} · {reserva.noites} noite
                {reserva.noites > 1 ? "s" : ""} · chegada{" "}
                {formatDateShort(reserva.checkin)}
              </p>
            </div>
            <StatusBadge liberado={liberado} />
          </div>
        </div>

        {/* Countdown / status */}
        <div className="mt-4 rounded-lg border border-border bg-card p-8 text-center">
          {liberado ? (
            <>
              <div className="text-xs text-muted-foreground uppercase" style={{ letterSpacing: 2 }}>
                Sua chegada é {hojeAmanha}
              </div>
              <div
                className="mt-3 text-2xl md:text-3xl font-medium"
                style={{ color: "oklch(0.55 0.14 145)" }}
              >
                Liberado para auto check-in ✓
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Check-in disponível a partir das 14h.
              </p>
            </>
          ) : (
            <>
              <div className="text-xs text-muted-foreground uppercase" style={{ letterSpacing: 2 }}>
                Códigos liberam em
              </div>
              <div className="mt-3 text-2xl md:text-3xl font-medium">
                {remaining.dias} {remaining.dias === 1 ? "dia" : "dias"} · {remaining.horas}h ·{" "}
                {remaining.minutos}min
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Por segurança, os códigos do portão e do quarto aparecem aqui
                24h antes da chegada.
              </p>
            </>
          )}
        </div>

        {/* Códigos */}
        <SectionTitle>Códigos de acesso</SectionTitle>
        <div
          className="rounded-lg p-6"
          style={
            liberado
              ? {
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                }
              : {
                  backgroundColor: "var(--background)",
                  border: "1px dashed var(--border)",
                }
          }
        >
          <CodeRow
            title="Portão da pousada"
            sub="Manter trancado após passar"
            code={liberado ? CODIGO_PORTAO : null}
            placeholder="— — —"
          />
          <div className="my-5 border-t border-border" />
          <CodeRow
            title={`Cofrinho ${reserva.room.article === "a" ? "da" : "do"} ${reserva.room.label}`}
            sub="Onde fica a chave do seu quarto"
            code={liberado ? reserva.room.codigoCofrinho : null}
            placeholder="— — — —"
          />
        </div>

        {/* Vídeo */}
        <SectionTitle>Vídeo de acesso</SectionTitle>
        {liberado ? (
          <div className="rounded-lg overflow-hidden border border-border bg-card mx-auto" style={{ maxWidth: 360 }}>
            <div
              className="relative flex items-center justify-center"
              style={{
                backgroundColor: "#1a1a1a",
                aspectRatio: "9 / 16",
              }}
            >
              <video
                controls
                preload="metadata"
                className="w-full h-full"
                poster=""
              >
                <source src={`/arquivos/CHECKIN.${reserva.quartoKey.toUpperCase()}.V2.MP4`} type="video/mp4" />
              </video>
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">
                Vídeo de acesso · 15s
              </div>
              <div className="mt-2 font-medium">Como chegar ao seu quarto</div>
              <p className="text-sm text-muted-foreground mt-1">
                Mostra o caminho do portão até{" "}
                {reserva.room.article === "a" ? "a" : "o"} {reserva.room.label}
                . Assista antes da chegada.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg p-8 text-center"
            style={{
              backgroundColor: "var(--background)",
              border: "1px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: 40 }}>🔒</div>
            <div className="mt-3 font-medium">
              Vídeo de acesso libera 24h antes
            </div>
            <div className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
              <div className="font-medium text-foreground">
                Como chegar ao seu quarto
              </div>
              <div className="mt-1">
                Vídeo curto mostrando o caminho do portão até{" "}
                {reserva.room.article === "a" ? "a" : "o"} {reserva.room.label}.
              </div>
            </div>
          </div>
        )}

        {/* PDF */}
        <SectionTitle>Documentos</SectionTitle>
        <div className="rounded-lg border border-border bg-card p-5 flex items-center gap-4">
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
              Disponível agora
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

        {/* Sua estadia */}
        <SectionTitle>Sua estadia</SectionTitle>
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          <FAQItem title="Endereço">
            Rua dos Ipês, lote 1 · Vila de São Jorge · Alto Paraíso de Goiás
            <div className="mt-2">
              <a
                href="https://goo.gl/maps/KR5nDdn7DZUAHmPZ6"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Abrir no Google Maps →
              </a>
            </div>
          </FAQItem>
          <FAQItem title="Wi-Fi">
            Rede <strong>Shanti</strong>
            <br />
            Senha <strong>flordoceu</strong>
          </FAQItem>
          <FAQItem title="Cozinha coletiva">
            Disponível das 7h30 às 20h. Há um filtro com água gelada no
            refeitório e as torneiras das cozinhas privativas também têm
            filtro.
          </FAQItem>
          <FAQItem title="Café da manhã">
            Não servimos, mas as cozinhas privativas e a cozinha coletiva têm
            itens básicos (sal, açúcar, óleo, temperos). Há também uma padaria
            e diversos outros estabelecimentos a 200m de nós que servem café da
            manhã.
          </FAQItem>
          <FAQItem title="Estacionamento">
            Em São Jorge os estabelecimentos não têm estacionamento interno. A
            melhor opção é estacionar ao longo do meio-fio. Com relação à
            segurança, é muito tranquilo. Recomendamos ir a pé para o centrinho
            e aproveitar a Vila assim — é tudo bem próximo.
          </FAQItem>
          <FAQItem title="Check-in antecipado (sob disponibilidade)">
            Nosso horário padrão é a partir das 14h. Entrada antes está sujeita
            à disponibilidade do quarto no dia. Para verificar, fale com a
            Paula pelo WhatsApp.
          </FAQItem>
        </div>

        {/* Antes de ir */}
        <SectionTitle>Antes de ir a São Jorge</SectionTitle>
        <div
          className="rounded-lg p-5"
          style={{
            backgroundColor: "var(--warning-bg)",
            border: "1px solid var(--warning-border)",
          }}
        >
          <div className="text-sm">
            <strong>Não há caixas eletrônicos em São Jorge:</strong> Traga
            dinheiro em espécie.
          </div>
          <div className="text-sm mt-3">
            <strong>Não há posto de gasolina em São Jorge:</strong> Abasteça
            antes.
          </div>
        </div>

        {/* Confirmar chegada */}
        {liberado && (
          <div className="mt-8 rounded-lg p-6 bg-primary text-primary-foreground">
            <div className="text-lg font-medium">Já chegou?</div>
            <p className="mt-1 text-sm opacity-90">
              Toque abaixo para nos avisar que você entrou na acomodação.
            </p>
            <button
              type="button"
              onClick={() => alert("Obrigada! Avisaremos a Paula.")}
              className="mt-4 rounded-md bg-card text-foreground font-medium px-5 py-2.5 text-sm hover:bg-background transition-colors"
            >
              Confirmar minha chegada
            </button>
          </div>
        )}

        {/* Suporte */}
        <div className="mt-8 rounded-lg border border-border bg-card p-5 text-sm">
          <div>
            Dúvidas, informações? Fale com a Paula:{" "}
            <a
              href={`https://wa.me/${WHATSAPP_PAULA}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              WhatsApp (21) 96407-7224
            </a>
          </div>
          <div className="mt-2">
            Apoio presencial na pousada: Genilda —{" "}
            <a
              href={`https://wa.me/${WHATSAPP_GENILDA}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              (62) 99854-6284
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-8 mb-3 text-xs text-muted-foreground"
      style={{ letterSpacing: 2, textTransform: "uppercase" }}
    >
      {children}
    </h2>
  );
}

function StatusBadge({ liberado }: { liberado: boolean }) {
  if (liberado) {
    return (
      <span
        className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
        style={{
          backgroundColor: "var(--primary-soft)",
          color: "var(--primary)",
        }}
      >
        ✓ Liberado
      </span>
    );
  }
  return (
    <span
      className="rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--destructive)",
        border: "1px solid var(--border)",
      }}
    >
      🔒 Bloqueado
    </span>
  );
}

function CodeRow({
  title,
  sub,
  code,
  placeholder,
}: {
  title: string;
  sub: string;
  code: string | null;
  placeholder: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
      <div
        className="text-xl md:text-2xl font-semibold whitespace-nowrap"
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
          letterSpacing: 2,
          color: code ? "var(--primary)" : "var(--muted-foreground)",
        }}
      >
        {code ? code : <span>🔒 {placeholder}</span>}
      </div>
    </div>
  );
}

function FAQItem({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5">
      <div className="font-medium text-sm">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}