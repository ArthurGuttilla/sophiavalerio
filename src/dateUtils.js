// Diferença em anos, meses e dias entre uma data-base e hoje (calendário real).
export function ymd(baseY, baseM, baseD, now = new Date()) {
  const from = new Date(baseY, baseM, baseD);
  let y = now.getFullYear() - from.getFullYear();
  let m = now.getMonth() - from.getMonth();
  let d = now.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    // dias do mês anterior ao atual
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  if (y < 0) { y = 0; m = 0; d = 0; }
  return { y, m, d };
}

// Formata {y,m,d} em português: "1 ano, 2 meses e 5 dias".
export function formatYMD({ y, m, d }) {
  const parts = [];
  if (y) parts.push(`${y} ${y === 1 ? "ano" : "anos"}`);
  if (m) parts.push(`${m} ${m === 1 ? "mês" : "meses"}`);
  if (d) parts.push(`${d} ${d === 1 ? "dia" : "dias"}`);
  if (parts.length === 0) return "hoje";
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(", ") + " e " + parts[parts.length - 1];
}

export function formatSince(baseY, baseM, baseD) {
  return formatYMD(ymd(baseY, baseM, baseD));
}
