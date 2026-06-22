// ─────────────────────────────────────────────────────────────
//  A DATA SECRETA — sem data explícita
//  Só é liberada depois que TODAS as datas regulares forem vistas
//  e os 10 pinguins coletados.
//  Cena interativa: chacoalhar para abrir, buquê, contagem, e o pedido.
//  Rota: /#/data/secreta
// ─────────────────────────────────────────────────────────────

export const SECRET_ID = "secreta";

export const secretDate = {
  id: SECRET_ID,
  dateLabel: "",
  kicker: "Surpresa",
  title: "Algo só nosso",
  motif: "hearts",
  scene: "secret",
  summary: "Você desbloqueou tudo. Tem mais uma coisa…",
  intro: "Você acabou de relembrar algumas das datas mais marcantes até agora.",
  finale: [
    "As palavras não possuem apenas um valor descritivo. Elas prescrevem. Não só dão contorno ao que já existe, mas definem, direcionam, criam novas realidades. Uma palavra certa faz algo ser, com um novo sentido, com uma nova dinâmica.",
    "Não estamos há {dias} dias nos conhecendo. Conhecer implica optar: gosto ou não gosto. Prefiro dizer que estamos construindo em todos esses dias. Construir aceita a realidade e acolhe a imperfeição humana. Dia após dia. Nos dias em que gostamos mais, nos dias em que gostamos menos.",
    "Construir implica uma escolha. E eu te escolhi, com todos os detalhes, por todos esses dias.",
  ],
};

// ─────────────────────────────────────────────────────────────
//  DEPOIS DA SURPRESA — 19 de junho de 2026 (a viagem)
//  Liberada junto com a data secreta. Rota: /#/data/viagem
// ─────────────────────────────────────────────────────────────
export const TRIP_ID = "viagem";

export const tripDate = {
  id: TRIP_ID,
  dateLabel: "19 de junho de 2026",
  kicker: "A nossa viagem",
  title: "Finalmente, esse dia chegou",
  motif: "hearts",
  scene: "trip",
  summary: "O dia da viagem: estrada, lareira e quase um 'eu te amo'.",
  photos: [
    { file: "media/images/2026-06-19-viagem", caption: "a nossa viagem" },
    { file: "media/images/2026-06-19-carro", caption: "a estrada" },
    { file: "media/images/2026-06-19-vinho", caption: "o vinho" },
  ],
  story: [
    "Finalmente esse dia chegou. O dia da nossa viagem. Minha manhã foi corrida no trabalho, tudo atrasou, mas eu não podia estar cansado, porque teria dias incríveis ao seu lado. Saindo das mentorias, corri buscar as flores surpresas, corri fechar a mala, o carro atrasou para chegar em casa, o portão travou, mas nada podia estragar esse momento.",
    "Te busquei em casa, a cidade parada para o jogo do Brasil e Haiti. Te entreguei um presente, um cartão com este site. Você decidiu registrar esses momentos desde o primeiro segundo, para assistirmos daqui a um ano. Demoramos para sair de SP, pegamos 4h de estrada, mas, como sempre, passou voando ao seu lado: conversando, trabalhando, se ajudando, se ouvindo, cantando bossa nova.",
    "Chegamos, assistimos o jogo do Brasil e, finalmente, você conheceu minha culinária: te fiz o molho Manetti (Arthuretti), com as abobrinhas não tão bem cortadas. Chorei e, me questionando, admiti que era de amor, de novo. Tomamos vinho, você quase acertou a senha do cartão, conversamos sobre o futuro, tiramos nossas dúvidas e inseguranças.",
    "Do jeito que a gente gosta, ficamos até as 4h da manhã juntinhos, conversando, na frente da lareira, se abrindo, se respeitando, se amando, mas ainda sem um nome. Nos despedimos, e me segurei muito para não soltar o primeiro “eu te amo”.",
  ],
};

// ─────────────────────────────────────────────────────────────
//  DEPOIS DA SURPRESA — 20 de junho de 2026 (o primeiro dia, oficial)
//  Liberada junto com a data secreta. Rota: /#/data/oficial
// ─────────────────────────────────────────────────────────────
export const OFFICIAL_ID = "oficial";

export const officialDate = {
  id: OFFICIAL_ID,
  dateLabel: "20 de junho de 2026",
  kicker: "Namorado e namorada",
  title: "O dia em que ganhou um nome",
  motif: "hearts",
  scene: "trip",
  summary: "O café, o diário, o sim, e 24h abraçados.",
  photos: [
    { file: "media/images/2026-06-20-1" },
    { file: "media/images/2026-06-20-2" },
    { file: "media/images/2026-06-20-3" },
    { file: "media/images/2026-06-20-4" },
    { file: "media/images/2026-06-20-5" },
    { file: "media/images/2026-06-20-6" },
    { file: "media/images/2026-06-20-7" },
    { file: "media/images/2026-06-20-8" },
    { file: "media/images/2026-06-20-9" },
    { file: "media/images/2026-06-20-10" },
    { file: "media/images/2026-06-20-11" },
    { file: "media/images/2026-06-20-12" },
    { type: "video", file: "media/videos/2026-06-20-video1" },
    { type: "video", file: "media/videos/2026-06-20-video2" },
  ],
  story: [
    "Eu acordei cedo, dormi pouco, porque queria te surpreender da forma linda que você merece. Fui buscar as flores que escondi no carro, preparei e embelezei a mesa para o nosso café, e não só a refeição, mas o café moído por nós. Você ainda não sabia a importância desse café, mas eu sabia.",
    "Entre interestelar, gengibre e pinguim, escolhi a palavra admiração. Porque é o que me fez querer te conhecer e é, dentre tantas qualidades, o que me faz te escolher. E, assim, você leu todo o nosso diário. Eu, ansioso, petiscando os deliciosos pães. Eu sei que você gostou, a dedicação valeu a pena. Você, entretida, sem comer nada. Se estamos nesta data, é porque você disse sim. E, enfim, nos denominamos namorado e namorada.",
    "Preparamos as massas de pizza, buscamos água da fonte, tomamos sol e preparamos nosso almoço, e que dupla formamos também na cozinha. Comemos bem e saudável, como valorizamos. Com direito à soneca pós-almoço mais gostosa que já tirei.",
    "No quentinho de uma lareira, o tempo parecia estar parado e como eu queria que aquele momento ficasse ali, para sempre. Vimos “About Time”, um filme sobre amor, sobre a vida, sobre tempo, e óbvio que desabei de chorar. Comecei a questionar se a sua presença não me traria mais sensibilidade sobre a vida, porque você me deixa confortável, porque você me deixa de coração aberto, porque você me faz me sentir como um garoto, com a minha essência, com o que eu era na ingenuidade da minha adolescência, mas com a maturidade do dia de hoje. E isso me faz te amar muito.",
    "Começamos a montar nossas pizzas, ouvindo jazz, tomando vinho, conversando, se aquecendo. A massa ficou boa, talvez não tanto quanto a do sogrão, mas mandamos bem, comemos bem, com e sem queijo, com um acerto melhor na segunda, de cogumelo (na qual você pegou um pedaço “divino”). E ficamos juntos, abraçados por 24h, o dia todo, até a hora de se deitar.",
  ],
};
