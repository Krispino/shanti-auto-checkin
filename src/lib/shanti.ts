export type RoomKey =
  | "caliandra"
  | "mangaba"
  | "caninde"
  | "seriema"
  | "maytreia"
  | "mantra";

export interface Room {
  label: string;
  article: "a" | "o";
  configs: string[];
  note: string;
  codigoCofrinho: string;
}

export const rooms: Record<RoomKey, Room> = {
  caliandra: {
    label: "Suíte Caliandra",
    article: "a",
    configs: ["Casal (2 pessoas)", "Solteiro — uso individual (1 pessoa)"],
    note: "A Suíte Caliandra acomoda apenas casal ou uso individual.",
    codigoCofrinho: "1000",
  },
  mangaba: {
    label: "Suíte Mangaba",
    article: "a",
    configs: [
      "Casal (2 pessoas)",
      "2 solteiros (2 pessoas)",
      "Solteiro — uso individual (1 pessoa)",
    ],
    note: "A Suíte Mangaba acomoda casal, 2 solteiros ou uso individual.",
    codigoCofrinho: "0200",
  },
  caninde: {
    label: "Duplex Caninde",
    article: "o",
    configs: ["Casal (2 pessoas)", "Solteiro — uso individual (1 pessoa)"],
    note: "O Duplex Caninde acomoda apenas casal ou uso individual.",
    codigoCofrinho: "0004",
  },
  seriema: {
    label: "Duplex Seriema",
    article: "o",
    configs: [
      "Casal (2 pessoas)",
      "2 solteiros (2 pessoas)",
      "Casal + 1 solteiro (3 pessoas)",
      "3 solteiros (3 pessoas)",
      "Casal + 2 solteiros (4 pessoas)",
      "Solteiro — uso individual (1 pessoa)",
    ],
    note: "O Duplex Seriema acomoda até 4 pessoas — casal, 2 solteiros, 3 solteiros, casal + 1 solteiro, casal + 2 solteiros ou uso individual.",
    codigoCofrinho: "0030",
  },
  maytreia: {
    label: "Chalé Maytreia",
    article: "o",
    configs: [
      "Casal (king size) (2 pessoas)",
      "Casal (king size) + 1 solteiro (cama adicional) - 3 pessoas",
      "Solteiro — uso individual (1 pessoa)",
    ],
    note: "O Chalé Maytreia acomoda casal (cama king size), casal (king size) + 1 solteiro em cama adicional, ou uso individual.",
    codigoCofrinho: "0005",
  },
  mantra: {
    label: "Chalé Mantra",
    article: "o",
    configs: ["Casal (2 pessoas)", "Solteiro — uso individual (1 pessoa)"],
    note: "O Chalé Mantra acomoda apenas casal ou uso individual.",
    codigoCofrinho: "0006",
  },
};

export const CODIGO_PORTAO = "002";
export const WHATSAPP_PAULA = "5521964077224";
export const WHATSAPP_GENILDA = "5562998546284";

export function isRoomKey(v: string | undefined | null): v is RoomKey {
  return !!v && Object.prototype.hasOwnProperty.call(rooms, v);
}

export interface ReservaParams {
  nome: string;
  quartoKey: RoomKey;
  room: Room;
  checkin: Date;
  checkout: Date;
  noites: number;
  rawNome?: string;
}

function parseDateLocal(s: string | null | undefined, fallback: Date): Date {
  if (!s) return fallback;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? fallback : d;
  }
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 14, 0, 0);
}

export function getReservaFromSearch(search: URLSearchParams): ReservaParams {
  const rawNome = search.get("nome") || "";
  const quartoParam = search.get("quarto") || search.get("acomodacao") || "caliandra";
  const quartoKey: RoomKey = isRoomKey(quartoParam) ? quartoParam : "caliandra";
  const now = new Date();
  const defCheckin = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const defCheckout = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const checkin = parseDateLocal(search.get("checkin"), defCheckin);
  const checkout = parseDateLocal(search.get("checkout"), defCheckout);
  const noites = Math.max(
    1,
    Math.round((checkout.getTime() - checkin.getTime()) / (24 * 60 * 60 * 1000)),
  );
  return {
    nome: rawNome || "hóspede",
    rawNome,
    quartoKey,
    room: rooms[quartoKey],
    checkin,
    checkout,
    noites,
  };
}

export function formatDateBR(d: Date): string {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

export function formatDateShort(d: Date): string {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function daysUntil(date: Date): number {
  const ms = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

export function useSearchParamsObject(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

export function preserveSearch(): string {
  if (typeof window === "undefined") return "";
  return window.location.search || "";
}