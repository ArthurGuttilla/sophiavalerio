// A história de nós, em datas.
// Cada entrada vira um cartão no calendário e uma experiência própria.
//
// Campos:
//   id      — slug único (também a rota /#/data/<id>)
//   day,month,year, dateLabel — exibição
//   title   — título da experiência
//   kicker  — pequena etiqueta acima do título
//   motif   — fundo animado: 'stars' | 'notes' | 'coffee' | 'hearts' | 'sparkle' | 'water' | 'dust'
//   summary — uma linha no cartão do calendário
//   story   — parágrafos da experiência (array)
//   quote   — frase marcante (opcional)
//   media   — links/embeds (opcional): { type:'spotify'|'link', label, url }

export const dates = [
  {
    id: "primeiro-seguir",
    day: 6, month: 4, year: 2026,
    dateLabel: "06 de abril de 2026",
    kicker: "Onde tudo começou",
    title: "O primeiro seguir",
    motif: "sparkle",
    scene: "story",
    summary: "O dia em que você começou a me seguir.",
    story: [
      "Foi através do stories de um aluno meu que você chegou até mim. Um detalhe pequeno, quase invisível no fluxo de um dia comum — e mesmo assim foi o primeiro fio dessa história inteira.",
      "Penso nisso e me parece improvável demais para ser acaso. Você apertou um botão e, sem saber, abriu uma porta.",
    ],
  },
  {
    id: "mesma-trilha-sonora",
    day: 25, month: 4, year: 2026,
    dateLabel: "25 de abril de 2026",
    kicker: "Descoberta",
    title: "A mesma trilha sonora",
    motif: "notes",
    scene: "vinyl",
    bgTrack: "2GqMnGQCXwrG9e4i7cznlS",
    bgTrackLabel: "My Funny Valentine — Frank Sinatra",
    summary: "Jazz, Sinatra, bossa nova — o mesmo gosto.",
    story: [
      "Descobrimos que ouvíamos o mesmo mundo: jazz, Frank Sinatra, bossa nova. Comecei a ouvir a sua playlist e era como entrar um pouco dentro da sua cabeça.",
      "Tem algo de íntimo em dividir música.",
    ],
    quote: "julgar é inerente ao homem rs",
    quoteAfter: "Nesse dia julguei, e gostei. Muito.",
    media: [
      {
        type: "spotify",
        label: "A playlist da Sophia",
        url: "https://open.spotify.com/playlist/3gcCHBkuYbcHCxrC0CEwnL",
      },
    ],
  },
  {
    id: "interstellar",
    day: 27, month: 4, year: 2026,
    dateLabel: "27 de abril de 2026",
    kicker: "Mesmo filme favorito",
    title: "Interestelar & Hans Zimmer",
    motif: "stars",
    scene: "starfield",
    bgTrack: "6pWgRkpqVfxnj3WuIcJ7WP",
    bgTrackLabel: "Cornfield Chase — Hans Zimmer",
    summary: "O mesmo filme favorito e a beleza do Hans Zimmer.",
    story: [
      "Interestelar — o mesmo filme favorito. Descobrir isso foi como achar que a gente já tinha assistido à vida pela mesma janela, mesmo antes de se conhecer.",
      "Apreciamos juntos a beleza do Hans Zimmer. “Cornfield Chase” e “Time” não são só músicas; são a prova de que amor e tempo são a mesma matéria.",
    ],
    media: [
      { type: "link", label: "Cornfield Chase", url: "https://www.youtube.com/results?search_query=hans+zimmer+cornfield+chase" },
      { type: "link", label: "Time", url: "https://www.youtube.com/results?search_query=hans+zimmer+time+interstellar" },
    ],
  },
  {
    id: "primeiro-convite-cafe",
    day: 29, month: 4, year: 2026,
    dateLabel: "29 de abril de 2026",
    kicker: "Coragem",
    title: "O primeiro convite para um café",
    motif: "coffee",
    summary: "O primeiro convite para um primeiro café.",
    story: [
      "O primeiro convite. Um café — simples, despretensioso e, ainda assim, o tipo de pergunta que muda o rumo das coisas.",
      "Eu não sabia para onde aquilo ia. Só sabia que queria mais um pouco da sua companhia.",
    ],
  },
  {
    id: "soho-house",
    day: 6, month: 5, year: 2026,
    dateLabel: "06 de maio de 2026",
    kicker: "Nos conhecemos",
    title: "O café na SOHO House",
    motif: "sparkle",
    summary: "Nosso 'pseudo-date' — te vi pela primeira vez ao vivo.",
    story: [
      "Na SOHO House SP, nosso “pseudo-date”. Foi o dia em que te vi ao vivo pela primeira vez, e em que percebemos que aquilo poderia ser algo a mais.",
      "Você me recomendou “Em Busca de Sentido”, o primeiro de muitos livros. E foi o dia em que eu me encantei — sem volta.",
    ],
    media: [
      { type: "link", label: "Man's Search for Meaning", url: "https://www.google.com/search?q=Man%27s+Search+for+Meaning+Viktor+Frankl" },
    ],
  },
  {
    id: "de-familia",
    day: 10, month: 5, year: 2026,
    dateLabel: "10 de maio de 2026",
    kicker: "Risos",
    title: "É de família",
    motif: "hearts",
    summary: "Descobri que gostar de um 'novinho' é de família.",
    story: [
      "Foi o dia em que descobri, rindo, que gostar de um “novinho” é de família. Você é mais velha que eu — e confesso que isso me diverte.",
      "No fim, a idade é só um detalhe técnico. O que conta é o quanto a gente se procura.",
    ],
  },
  {
    id: "convite-oficial",
    day: 11, month: 5, year: 2026,
    dateLabel: "11 de maio de 2026",
    kicker: "Intenção",
    title: "O convite oficial",
    motif: "hearts",
    summary: "O convite para o primeiro date com intenção de date.",
    story: [
      "Dessa vez sem disfarce: o convite oficial para o primeiro date com intenção de ser date.",
      "Dar nome às coisas é assumir o risco delas. E eu quis correr esse risco com você.",
    ],
  },
  {
    id: "convites-agenda",
    day: 15, month: 5, year: 2026,
    dateLabel: "15 de maio de 2026",
    kicker: "Detalhes que combinam",
    title: "Convites em agenda",
    motif: "dust",
    scene: "agenda",
    summary: "Descobrimos que ambos amamos um convite na agenda.",
    story: [
      "Descobrimos que os dois amam um convite em agenda. Pode parecer pequeno, mas é exatamente nos detalhes que a gente se reconhece.",
      "Reservar um horário para alguém é uma declaração discreta: eu te coloco no meu tempo.",
    ],
  },
  {
    id: "primeiro-date",
    day: 16, month: 5, year: 2026,
    dateLabel: "16 de maio de 2026",
    kicker: "O grande dia",
    title: "O primeiro date",
    motif: "hearts",
    scene: "kiss",
    showMap: true,
    summary: "Cora, Café Longão e o primeiro beijo — apressado.",
    story: [
      "No Cora, no centro de São Paulo, nosso primeiro date. A gente fechou o restaurante, foi para o Café Longão do ladinho, e fechou o café também.",
      "E então veio o primeiro beijo — apressado, meio sem jeito. O tipo de pressa que só existe quando o tempo não quer ser suficiente.",
    ],
  },
  {
    id: "admiracao",
    day: 17, month: 5, year: 2026,
    dateLabel: "17 de maio de 2026",
    kicker: "O melhor elogio",
    title: "Admiração",
    motif: "sparkle",
    summary: "Colocamos a admiração mútua como o melhor elogio.",
    story: [
      "Foi o dia em que combinamos que admiração é o melhor elogio que existe. Apesar de te achar maravilhosa, admirar você é o mais atraente de tudo — e sei que isso é algo nosso, em comum.",
      "Eu te admiro. E descobrir que você me admira de volta foi entender que a gente não está só se gostando: está se construindo, um confiando no outro um pedaço de cada vez.",
    ],
  },
  {
    id: "olho-no-olho",
    day: 18, month: 5, year: 2026,
    dateLabel: "18 de maio de 2026",
    kicker: "Saudade",
    title: "Conversas olho no olho",
    motif: "dust",
    summary: "Mais um convite — e o nosso gosto por vinho seco.",
    story: [
      "Mais um convite, porque eu já não aguentava ficar sem as longas conversas olhando no fundo dos seus olhos.",
      "Foi também o dia em que alinhamos nosso gosto por vinho seco. Coisa de quem prefere o que tem caráter ao que é fácil.",
    ],
  },
  {
    id: "troca-de-inteligencia",
    day: 20, month: 5, year: 2026,
    dateLabel: "20 de maio de 2026",
    kicker: "Mentes que trocam",
    title: "Compartilhar inteligência",
    motif: "dust",
    summary: "Podcasts, vídeos, filmes, livros — e o Claude.",
    story: [
      "A troca se intensificou: podcasts, vídeos, filmes, livros. Virou um fluxo constante de “precisa ver isso” e “me conta o que achou”.",
      "Foi também o dia em que você viu meu workshop de Claude e passou a usá-lo no dia a dia. Adoro que a gente cresça junto, inclusive de cabeça.",
    ],
  },
  {
    id: "casa-bradesco",
    day: 21, month: 5, year: 2026,
    dateLabel: "21 de maio de 2026",
    kicker: "Arte e tempo",
    title: "I am the other's other",
    motif: "water",
    scene: "ocean",
    summary: "Exposição na Casa Bradesco e o tempo que voa com você.",
    story: [
      "Café e a exposição “I am the other's other” na Casa Bradesco. Descobri que você gosta de animais aquáticos — e tive certeza de que o tempo com você passa rápido demais.",
      "Você ainda me conquistou de outro jeito: descobrir seus certificados no Google e na AWS, onde eu já trabalhei. Beleza e mente, no mesmo lugar.",
    ],
  },
  {
    id: "video-da-paz",
    day: 23, month: 5, year: 2026,
    dateLabel: "23 de maio de 2026",
    kicker: "Paz",
    title: "O vídeo da paz",
    motif: "dust",
    summary: "Um vídeo seu que me trouxe uma paz rara.",
    story: [
      "Você me mandou um vídeo seu que, acho, foi um dos que me trouxe a maior sensação de paz que eu já senti.",
      "Tem gente que agita; você acalma. E descobrir isso foi entender que a sua presença é também um lugar de descanso.",
    ],
  },
  {
    id: "jejum-jogos-morte",
    day: 24, month: 5, year: 2026,
    dateLabel: "24 de maio de 2026",
    kicker: "Profundidade",
    title: "Jejum, jogos e a morte",
    motif: "stars",
    summary: "Jejum, jogos de tabuleiro e conversas sobre a morte.",
    story: [
      "Descobrimos que o jejum faz parte da rotina dos dois, que amamos jogos de tabuleiro e — talvez o mais raro — que gostamos de conversar fundo sobre a morte.",
      "Falar da finitude com alguém é, no fundo, falar do quanto a vida importa. Poucas pessoas aguentam essa conversa. Você abraça.",
    ],
  },
  {
    id: "vida-natural",
    day: 25, month: 5, year: 2026,
    dateLabel: "25 de maio de 2026",
    kicker: "Cuidado",
    title: "Vida natural",
    motif: "dust",
    summary: "Vida saudável e o desafio de cozinhar um pro outro.",
    story: [
      "Descobrimos que valorizamos muito uma vida saudável, orgânica e natural. E nos desafiamos a cozinhar um para o outro.",
      "Cozinhar para alguém é um cuidado que se come. Mal posso esperar pela sua cozinha — e por te cozinhar a minha.",
    ],
  },
  {
    id: "cafe-mais-fundo",
    day: 26, month: 5, year: 2026,
    dateLabel: "26 de maio de 2026",
    kicker: "Ritual",
    title: "Café, ainda mais fundo",
    motif: "coffee",
    summary: "Nossa paixão por café ficou ainda mais profunda.",
    story: [
      "Nossa paixão por café ficou ainda mais profunda. Virou ritual, linguagem, desculpa boa para mais um encontro.",
      "Tem amor que se mede em xícaras. O nosso transborda.",
    ],
  },
  {
    id: "piano-lalaland",
    day: 27, month: 5, year: 2026,
    dateLabel: "27 de maio de 2026",
    kicker: "Coincidência bizarra",
    title: "Mia & Sebastian's Theme",
    motif: "notes",
    scene: "piano",
    summary: "Toquei no piano exatamente a música que você ouvia.",
    story: [
      "Mostrei meu antigo talento no piano e estava tocando, por uma coincidência bizarra, exatamente a música que você estava ouvindo: “Mia & Sebastian's Theme”, de La La Land.",
      "Tem coincidências que parecem roteiro. Essa foi a nossa cena de filme.",
    ],
    media: [
      { type: "link", label: "Mia & Sebastian's Theme", url: "https://www.youtube.com/results?search_query=mia+and+sebastian%27s+theme+la+la+land" },
    ],
  },
  {
    id: "astrologia",
    day: 28, month: 5, year: 2026,
    dateLabel: "28 de maio de 2026",
    kicker: "Os céus",
    title: "Astrologia e estrelas",
    motif: "stars",
    scene: "starfield",
    summary: "Nossa paixão pelos céus, estrelas e fenômenos.",
    story: [
      "Descobrimos a paixão conjunta por astrologia, estrelas e os fenômenos do céu. A gente olha para cima e se entende.",
      "E você me marcou com uma frase que eu guardo até hoje.",
    ],
    quote: "se arrumar com calma porque eu quero ficar bem cheirosa pra você",
  },
  {
    id: "jantar-italiano",
    day: 29, month: 5, year: 2026,
    dateLabel: "29 de maio de 2026",
    kicker: "Velas e vinho",
    title: "Jantar italiano",
    motif: "hearts",
    summary: "Pizza da Broto, velas, vinho no Varal — e mais um beijo.",
    story: [
      "Um jantar tipicamente italiano: pizza da Broto, em Pinheiros. Olho no olho, velas na mesa, e depois um vinho no Varal Bar.",
      "E mais um beijo — sem a pressa do primeiro, dessa vez. O tipo de beijo de quem já sabe que quer ficar.",
    ],
  },
];

export function getDate(id) {
  return dates.find((d) => d.id === id);
}
