// ─────────────────────────────────────────────────────────────
//  Progressão das datas
//  Cada data só é liberada depois que a anterior é vista.
//  O progresso fica salvo no localStorage (persiste entre sessões).
// ─────────────────────────────────────────────────────────────
import { dates } from "./data/dates.js";

const KEY = "sv_seen"; // lista de ids de datas já vistas

export function getSeen() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markSeen(id) {
  const seen = getSeen();
  if (!seen.includes(id)) {
    seen.push(id);
    try {
      localStorage.setItem(KEY, JSON.stringify(seen));
    } catch {
      /* ignore */
    }
  }
}

// Libera todas as datas de uma vez (easter egg do título "dias").
export function markAllSeen() {
  try {
    localStorage.setItem(KEY, JSON.stringify(dates.map((d) => d.id)));
  } catch {
    /* ignore */
  }
}

// A primeira data está sempre liberada. As demais exigem ter visto a anterior.
export function isUnlocked(index, seen = getSeen()) {
  if (index <= 0) return true;
  const prev = dates[index - 1];
  return prev ? seen.includes(prev.id) : false;
}

// Índice de uma data pelo id (ou -1 se for a secreta / inexistente).
export function indexOf(id) {
  return dates.findIndex((d) => d.id === id);
}

// Liberada para acessar diretamente (usado como guarda na experiência).
export function canAccess(id, seen = getSeen()) {
  const i = indexOf(id);
  if (i === -1) return false; // datas fora do array regular (ex.: secreta) têm regra própria
  return isUnlocked(i, seen);
}

// Todas as datas regulares já foram vistas?
export function allSeen(seen = getSeen()) {
  return dates.every((d) => seen.includes(d.id));
}

// Quantas datas já foram desbloqueadas (para exibição/progresso).
export function unlockedCount(seen = getSeen()) {
  let n = 0;
  for (let i = 0; i < dates.length; i++) {
    if (isUnlocked(i, seen)) n++;
    else break;
  }
  return n;
}
