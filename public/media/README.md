# Mídia (imagens e vídeos das datas)

Suba aqui os arquivos que serão usados nas experiências de cada data.

## Onde colocar

- **Imagens** → `public/media/images/`
- **Vídeos** → `public/media/videos/`
- **Áudio (música de fundo)** → `public/media/audio/`

## Música de fundo das datas

Algumas datas tocam uma música de fundo suave. O caminho já está
referenciado no código (`src/data/dates.js`, campo `bgAudio`). Basta
subir o arquivo MP3 com o nome exato:

| Data | Arquivo esperado | Música |
|------|------------------|--------|
| 25/04 | `public/media/audio/my-funny-valentine.mp3` | My Funny Valentine — Frank Sinatra |
| 27/04 | `public/media/audio/cornfield-chase.mp3` | Cornfield Chase — Hans Zimmer |

Enquanto o arquivo não existir, a página funciona normalmente — só não
toca o som. A música começa após o primeiro toque/clique na página
(navegadores bloqueiam autoplay), e há um botão discreto de ligar/desligar.

> ⚠️ Direitos autorais: use apenas arquivos que você tem direito de usar.

## Como referenciar no código

Tudo dentro de `public/` é servido na raiz do site. Como o build usa
caminhos relativos (`base: "./"`), **use caminhos relativos com `import.meta.env.BASE_URL`**
ou caminhos relativos simples a partir da raiz publicada.

A forma mais segura, que funciona tanto local quanto no GitHub Pages
(em subpath), é montar a URL assim:

```js
const src = `${import.meta.env.BASE_URL}media/images/seu-arquivo.jpg`;
```

Exemplo num objeto de data em `src/data/dates.js`:

```js
{
  id: "primeiro-date",
  // ...
  photo: "media/images/cora.jpg",       // relativo a public/
  video: "media/videos/abraco.mp4",
}
```

E no componente da cena:

```jsx
<img src={`${import.meta.env.BASE_URL}${d.photo}`} alt="" />
<video src={`${import.meta.env.BASE_URL}${d.video}`} controls playsInline />
```

## Formatos recomendados

- **Imagens:** `.webp` ou `.jpg` (otimizadas; idealmente < 500 KB cada).
- **Vídeos:** `.mp4` (H.264) para máxima compatibilidade; mantenha curtos
  e comprimidos para carregar rápido.

## Importante

O GitHub Pages tem limite prático de tamanho de repositório. Para vídeos
grandes, prefira hospedar fora (ex.: link do YouTube/Vimeo) e referenciar
por link, em vez de subir o arquivo aqui.
