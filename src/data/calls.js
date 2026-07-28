// Top 5 ligações mais longas (referência: histórico de chamadas 08/06–28/07/2026,
// agrupado por conversa com gap ≤ 5 min). Valores da saída de validação, com a
// última chamada (28/07, 3h11m08s) incorporada.
export const callRanking = [
  { rank: 1, date: "22 de julho", dur: "3h40", full: "03:40:48", media: "vídeo" },
  { rank: 2, date: "27 de julho", dur: "3h11", full: "03:11:08", media: "vídeo" },
  { rank: 3, date: "16 de julho", dur: "2h52", full: "02:52:22", media: "vídeo" },
  { rank: 4, date: "20 de julho", dur: "2h33", full: "02:33:15", media: "vídeo" },
  { rank: 5, date: "30 de junho", dur: "2h09", full: "02:09:09", media: "vídeo" },
];

// Soma total (21:20:18 + 03:11:08 = 24:31:26).
export const callTotals = {
  value: "24h31",
  full: "24:31:26",
  period: "de 08/06 a 27/07",
};
