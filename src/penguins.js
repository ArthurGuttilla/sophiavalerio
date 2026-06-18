// ─────────────────────────────────────────────────────────────
//  Caça aos pinguins 🐧
//  10 pinguins espalhados pelas telas (a partir de 06/05). O usuário
//  coleta clicando; o progresso fica na sessão (sessionStorage), igual
//  às datas. Coletar todos é requisito extra para liberar a data surpresa.
// ─────────────────────────────────────────────────────────────

export const PENGUIN_TOTAL = 10;

// As 10 datas que escondem um pinguim, espalhadas de 06/05 a 13/06.
export const PENGUIN_DATES = [
  "soho-house",       // 06/05
  "primeiro-date",    // 16/05
  "olho-no-olho",     // 18/05
  "casa-bradesco",    // 21/05
  "vida-natural",     // 25/05
  "piano-lalaland",   // 27/05
  "jantar-italiano",  // 29/05
  "hiato",            // 03/06
  "reencontro",       // 08/06
  "dia-treze",        // 13/06
];

const KEY = "sv_penguins";

export function getPenguins() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function collectPenguin(id) {
  const p = getPenguins();
  if (!p.includes(id)) {
    p.push(id);
    try {
      sessionStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  }
  return p;
}

export function hasPenguin(id, p = getPenguins()) {
  return p.includes(id);
}

export function penguinCount(p = getPenguins()) {
  return p.length;
}

export function allPenguins(p = getPenguins()) {
  return PENGUIN_TOTAL > 0 && PENGUIN_DATES.every((id) => p.includes(id));
}

// Coleta todos de uma vez (easter egg do "coração").
export function markAllPenguins() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(PENGUIN_DATES.slice()));
  } catch {
    /* ignore */
  }
}
