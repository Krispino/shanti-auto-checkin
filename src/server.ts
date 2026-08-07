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

// Senha usada enquanto o secret ADMIN_SENHA não estiver configurado.
// Fica só no código do servidor — nunca é enviada ao navegador.
const ADMIN_SENHA_PADRAO = "20shanti22";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function adminSenha(env: Record<string, unknown>): string {
  return typeof env.ADMIN_SENHA === "string" && env.ADMIN_SENHA
    ? env.ADMIN_SENHA
    : ADMIN_SENHA_PADRAO;
}

function senhaConfere(request: Request, env: Record<string, unknown>): boolean {
  return request.headers.get("x-admin-senha") === adminSenha(env);
}

interface Cadastro {
  nome?: string;
  checkin?: string;
  [k: string]: unknown;
}

// Consulta o Apps Script com o token secreto (env.SHEETS_TOKEN). O token nunca
// chega ao cliente — só este Worker o conhece.
async function consultarSheets(
  env: Record<string, unknown>,
  params: { nome?: string | null; checkin?: string | null },
): Promise<Cadastro[]> {
  const token = typeof env.SHEETS_TOKEN === "string" ? env.SHEETS_TOKEN : "";
  const upstream = new URL(SHEETS_ENDPOINT);
  upstream.searchParams.set("token", token);
  if (params.nome) upstream.searchParams.set("nome", params.nome);
  if (params.checkin) upstream.searchParams.set("checkin", params.checkin);

  const res = await fetch(upstream.toString());
  const data = (await res.json()) as { resultados?: Cadastro[] };
  return data.resultados ?? [];
}

// Busca completa — devolve dados pessoais de hóspedes, então exige a senha
// do admin. Sem ela, responde 401 sem consultar nada.
async function handleBuscar(request: Request, env: Record<string, unknown>): Promise<Response> {
  if (!senhaConfere(request, env)) {
    return json({ resultados: [], erro: "nao autorizado" }, 401);
  }
  const url = new URL(request.url);
  try {
    const resultados = await consultarSheets(env, {
      nome: url.searchParams.get("nome"),
      checkin: url.searchParams.get("checkin"),
    });
    return json({ resultados });
  } catch {
    return json({ resultados: [] }, 502);
  }
}

function normalizarNome(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

// Checagem de duplicata usada pelo formulário público. Responde apenas
// {existe: boolean} — nunca devolve dados de hóspede. A busca do Apps Script
// casa por trecho do nome ("ana" acha "Mariana"), então o nome é comparado
// por igualdade exata aqui antes de responder.
async function handleChecarDuplicata(
  request: Request,
  env: Record<string, unknown>,
): Promise<Response> {
  const url = new URL(request.url);
  const nome = url.searchParams.get("nome");
  const checkin = url.searchParams.get("checkin");
  if (!nome || !checkin) return json({ existe: false });

  try {
    const resultados = await consultarSheets(env, { nome });
    const alvo = normalizarNome(nome);
    const existe = resultados.some(
      (r) => normalizarNome(String(r.nome ?? "")) === alvo && r.checkin === checkin,
    );
    return json({ existe });
  } catch {
    // Se a checagem falhar, não bloqueia o hóspede.
    return json({ existe: false });
  }
}

function handleLogin(request: Request, env: Record<string, unknown>): Response {
  return senhaConfere(request, env)
    ? json({ ok: true })
    : json({ ok: false }, 401);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const environment = (env ?? {}) as Record<string, unknown>;
      if (url.pathname === "/api/buscar") {
        return await handleBuscar(request, environment);
      }
      if (url.pathname === "/api/checar-duplicata") {
        return await handleChecarDuplicata(request, environment);
      }
      if (url.pathname === "/api/login") {
        return handleLogin(request, environment);
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
