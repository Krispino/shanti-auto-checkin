import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyzkbdi8IU7lD3jYk3D9sc8E90YKwGKWiW_-IDGlE2vPY1AczZ5Er4zFc1sHlAw37Vd/exec";

// Proxy protegido: o navegador chama /api/buscar sem token; aqui adicionamos o
// token secreto (env.SHEETS_TOKEN) e repassamos ao Apps Script. O token nunca
// chega ao cliente.
async function handleBuscar(request: Request, env: Record<string, unknown>): Promise<Response> {
  const url = new URL(request.url);
  const nome = url.searchParams.get("nome");
  const checkin = url.searchParams.get("checkin");
  const token = typeof env.SHEETS_TOKEN === "string" ? env.SHEETS_TOKEN : "";

  const upstream = new URL(SHEETS_ENDPOINT);
  upstream.searchParams.set("token", token);
  if (nome) upstream.searchParams.set("nome", nome);
  if (checkin) upstream.searchParams.set("checkin", checkin);

  try {
    const res = await fetch(upstream.toString());
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch {
    return new Response(JSON.stringify({ resultados: [] }), {
      status: 502,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/buscar") {
        return await handleBuscar(request, (env ?? {}) as Record<string, unknown>);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
