# Mídia do site (fotos, vídeos e áudio)

Os arquivos ficam em `public/media/` e são publicados junto com o site.
**O site já está conectado aos nomes abaixo** — é só subir o arquivo com o
**nome exato** e ele aparece sozinho. Enquanto o arquivo não existir, a
página mostra um placeholder elegante (nada quebra).

## Pastas

```
public/media/
  images/   → fotos (.jpg)
  videos/   → vídeos (.mp4)
  audio/    → áudios (.mp3)
```

## Convenção de nomes

`AAAA-MM-DD-descricao.ext` (data da memória + descrição curta, tudo minúsculo,
sem espaços nem acentos).

## Arquivos que o site espera hoje

| Data  | Tipo  | Caminho exato (suba com este nome) |
|-------|-------|------------------------------------|
| 21/05 | foto  | `public/media/images/2026-05-21-primeira-foto.jpg` |
| 23/05 | vídeo | `public/media/videos/2026-05-23-video-da-paz.mp4` |
| 04/06 | áudio | `public/media/audio/2026-06-04-minha-voz.mp3` |
| 08/06 | foto  | `public/media/images/2026-06-08-reencontro.jpg` |

> Use exatamente essas extensões (`.jpg`, `.mp4`, `.mp3`). Se o seu arquivo
> for `.jpeg`/`.png`/`.heic`, renomeie/converta para `.jpg` antes de subir.

## Como subir (pelo navegador, sem terminal)

1. No GitHub, entre na pasta certa (ex.: `public/media/images`).
2. **Add file → Upload files**, arraste o arquivo (com o nome exato da tabela).
3. **Commit changes** no branch `main`.
4. O deploy roda sozinho; em ~1–2 min a mídia aparece no site.

## Formatos e tamanhos recomendados

- **Fotos:** `.jpg`, lado maior ~1600px, < 500 KB se possível.
- **Vídeos:** `.mp4` (H.264), curtos e comprimidos. Para vídeos grandes,
  prefira hospedar no YouTube e me pedir para embutir por link.
- **Áudio:** `.mp3`, 128–192 kbps.

## Adicionar mídia a uma data nova

Cada data em `src/data/dates.js` aceita os campos:
`photo` / `photoPlaceholder`, `video` / `videoPlaceholder`,
`audio` / `audioLabel`. Aponte para `media/.../arquivo.ext` (sem a barra
inicial) e pronto.
