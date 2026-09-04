import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShantiLogo } from "@/components/shanti-logo";

// Destino real — a página de roteiros do site, já com SEO próprio (título e
// descrição voltados pra busca no Google). Essa rota existe só pra dar uma
// prévia diferente quando o link é colado numa mensagem de WhatsApp: sem ela,
// o WhatsApp mostra o og:title/descrição da página de SEO, que soa como
// anúncio dentro de uma mensagem pessoal de "chegou bem, aproveita".
const DESTINO =
  "https://shantipousada.com.br/chapada-dos-veadeiros/?utm_source=whatsapp&utm_medium=chegada&utm_content=dicas#dicas";

export const Route = createFileRoute("/dicas")({
  head: () => ({
    meta: [
      { title: "Dicas para a sua viagem — Shanti Pousada" },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Dicas para a sua viagem" },
      {
        property: "og:description",
        content:
          "Trilhas, cachoeiras e onde comer em São Jorge — para aproveitar a sua estadia na Chapada dos Veadeiros.",
      },
      {
        property: "og:image",
        content: "https://shantipousada.com.br/content/chapada/parque/saltos-carrossel/saltos-carrossel-parque-nacional-chapada-dos-veadeiros-06.webp",
      },
      {
        name: "twitter:image",
        content: "https://shantipousada.com.br/content/chapada/parque/saltos-carrossel/saltos-carrossel-parque-nacional-chapada-dos-veadeiros-06.webp",
      },
    ],
  }),
  component: Dicas,
});

function Dicas() {
  // Redireciona só no navegador — o crawler que gera a prévia do WhatsApp
  // não executa JS, então ele lê a metadata desta página, não a do destino.
  useEffect(() => {
    window.location.replace(DESTINO);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center px-5">
        <ShantiLogo />
        <p className="mt-6 text-sm text-muted-foreground">
          Levando você para as dicas da Chapada dos Veadeiros...
        </p>
        <a href={DESTINO} className="mt-2 inline-block text-sm text-primary hover:underline">
          Clique aqui se não for redirecionado
        </a>
      </div>
    </main>
  );
}
