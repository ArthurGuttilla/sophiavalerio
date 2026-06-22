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
  photo: "media/images/2026-06-19-viagem.jpg",
  photoPlaceholder: "um registro da nossa viagem",
  story: [
    "Finalmente esse dia chegou. O dia da nossa viagem. Minha manhã foi corrida no trabalho, tudo atrasou, mas eu não podia estar cansado, porque teria dias incríveis ao seu lado. Saindo das mentorias, corri buscar as flores surpresas, corri fechar a mala, o carro atrasou para chegar em casa, o portão travou, mas nada podia estragar esse momento.",
    "Te busquei em casa, a cidade parada para o jogo do Brasil e Haiti. Te entreguei um presente, um cartão com este site. Você decidiu registrar esses momentos desde o primeiro segundo, para assistirmos daqui a um ano. Demoramos para sair de SP, pegamos 4h de estrada, mas, como sempre, passou voando ao seu lado: conversando, trabalhando, se ajudando, se ouvindo, cantando bossa nova.",
    "Chegamos, assistimos o jogo do Brasil e, finalmente, você conheceu minha culinária: te fiz o molho Manetti (Arthuretti), com as abobrinhas não tão bem cortadas. Chorei e, me questionando, admiti que era de amor, de novo. Tomamos vinho, você quase acertou a senha do cartão, conversamos sobre o futuro, tiramos nossas dúvidas e inseguranças.",
    "Do jeito que a gente gosta, ficamos até as 4h da manhã juntinhos, conversando, na frente da lareira, se abrindo, se respeitando, se amando, mas ainda sem um nome. Nos despedimos, e me segurei muito para não soltar o primeiro “eu te amo”.",
  ],
};
