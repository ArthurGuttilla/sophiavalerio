# Sophia Valerio — Personal Website

Site de marca pessoal minimalista e editorial. A landing apresenta a assinatura
e um botão **Start**; a `/home` é um **calendário de datas especiais** protegido
por senha, onde cada data abre uma experiência animada própria.

Veja [`PRD.md`](./PRD.md) para os requisitos da Fase 1 (landing).

## Stack

- **Vite + React** — app SPA moderno e rápido.
- **Framer Motion** — animações de entrada, transições de página e fundos sutis.
- **React Router (HashRouter)** — rotas que funcionam em qualquer subpath do
  GitHub Pages, sem 404 em deep links.
- Sem backend: todo o conteúdo é estático. Hospedagem gratuita no GitHub Pages.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/
npm run preview  # serve o build
```

## Estrutura

```
index.html              Entry do Vite
src/
  main.jsx              Router + rotas
  index.css             Design tokens
  components.css        Estilos de gate, calendário e experiência
  config.js             Senha do gate (hash) — veja abaixo
  data/dates.js         Todas as datas e suas histórias  ← edite aqui
  components/
    Landing.jsx         Splash (assinatura + Start)
    Home.jsx            Gate de senha + calendário
    Experience.jsx      Página de cada data
    Motif.jsx           Fundos animados (estrelas, notas, café, corações…)
```

## Senha do gate

Senha padrão: **`interestelar`**. É um cadeado leve (client-side) — afasta
visitantes casuais e evita indexação, mas não é segurança real.

Para trocar, siga as instruções em [`src/config.js`](./src/config.js).

## Adicionar / editar uma data

Tudo vem de [`src/data/dates.js`](./src/data/dates.js). Cada item tem título,
história (parágrafos), frase marcante opcional, mídia (link/Spotify) e um
`motif` para o fundo animado. Adicionar um objeto novo já cria o cartão no
calendário e a página da experiência.

## Deploy no GitHub Pages

O workflow [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)
builda e publica a cada push em `main`. No repositório:
**Settings → Pages → Source: GitHub Actions**.

O `base: './'` do Vite + HashRouter garantem que funcione tanto em domínio
próprio quanto em subpath (`https://<user>.github.io/sophiavalerio/`).

## Acessibilidade

- Contraste WCAG AA, foco visível por teclado, navegação por teclado.
- `prefers-reduced-motion` respeitado: fundos animados e movimentos são
  desativados, mantendo apenas fades suaves.
