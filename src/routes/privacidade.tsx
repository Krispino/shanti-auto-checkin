import { createFileRoute } from "@tanstack/react-router";
import { ShantiLogo } from "@/components/shanti-logo";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade — Shanti Pousada" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Privacidade,
});

function Privacidade() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto px-5 py-12 md:py-16" style={{ maxWidth: 640 }}>
        <ShantiLogo />
        <h1 className="mt-8 text-2xl md:text-3xl font-medium tracking-tight">
          Política de privacidade
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Última atualização: setembro de 2026
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-medium mb-2">Quais dados coletamos</h2>
            <p>
              No pré-check-in, coletamos nome, documento, e-mail, cidade,
              estado e detalhes da sua reserva (quarto, datas, acompanhantes).
              Esses dados são necessários para preparar a sua chegada.
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">Para que usamos</h2>
            <p>
              Usamos os dados para viabilizar o check-in, liberar os códigos
              de acesso e dar suporte durante a sua estadia. Se você marcar a
              opção de receber dicas e novidades, também usamos seu contato
              para enviar dicas da Chapada dos Veadeiros e cupons
              promocionais.
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">Com quem compartilhamos</h2>
            <p>
              Não vendemos nem compartilhamos seus dados com terceiros para
              fins de marketing. Os dados ficam com a equipe da Shanti
              Pousada e são usados apenas para a operação da hospedagem.
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">Comunicação por WhatsApp</h2>
            <p>
              Se você optou por receber dicas e novidades, pode cancelar a
              qualquer momento respondendo "SAIR" em qualquer mensagem
              recebida.
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">Seus direitos</h2>
            <p>
              Você pode solicitar a exclusão ou correção dos seus dados a
              qualquer momento, falando com a gente pelo WhatsApp da Shanti
              Pousada.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
