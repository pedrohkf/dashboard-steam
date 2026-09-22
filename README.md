# Steam XP

Uma dashboard da Steam disfarçada de Windows XP. Você cria conta com o seu Steam ID, faz login numa tela de boas-vindas old-school, e vê sua biblioteca de jogos dentro de uma área de trabalho retrô — com direito a Lixeira automática pros jogos que você nunca abriu.

![status](https://img.shields.io/badge/status-em%20desenvolvimento-blue) ![licença](https://img.shields.io/badge/uso-educacional-lightgrey)

---

## Por que Windows XP

Windows XP foi meu primeiro sistema operacional. Lá por 2010, com uns 5 anos, era o PC que eu mais mexia em casa — o som de login, o fundo "Bliss" (aquela colina verde com céu azul) grudaram na memória. Esse projeto me fez lembrar a boa epoca, pra recriar aquela estética junto com algo que uso hoje, a Steam, misturando as duas nostalgias, a do sistema operacional e a da biblioteca de jogos.

## Demo

As telas principais do projeto estão em `public/imgs/prints/` e exibidas na seção "Telas" da home (`index.html`):

| Tela | Descrição |
|---|---|
| `loading.png` | Boot com barra de progresso azul clássica |
| `login.png` | Seleção de usuário estilo Windows XP |
| `register.png` | Assistente de instalação (cadastro) |
| `desktop-1.png` / `desktop-2.png` | Área de trabalho com janelas da Steam e da Lixeira |
| `crash.png` | Tela azul de erro (BSOD) com mensagem |

## Funcionalidades

- **Cadastro com Steam ID real** — valida contra a API pública da Steam, busca nome e biblioteca de jogos.
- **Login multiusuário** — lista de contas salvas no `localStorage`, com senha por conta.
- **Sessão** — guardada em `sessionStorage`, expira ao fechar a aba/logoff.
- **Biblioteca da Steam** dentro de uma janela XP, ordenada por tempo jogado.
- **Lixeira automática** — todo jogo com 0 minutos jogados cai lá sozinho.
- **"Esvaziar lixeira"** é uma pegadinha — não apaga nada, só avisa que os jogos continuam na biblioteca.
- **Logoff** volta pro login; **Desligar** manda pra uma tela de crash (BSOD) com mensagem gerada a partir do jogo mais jogado.
- **Relógio da taskbar** atualizado em tempo real.

## Fluxo da aplicação

```
index.html (apresentação)
     │  clique em "Iniciar"
     ▼
loading.html ──(3s, setTimeout)──► desktop.html
                                        │
                          sem sessão?   │   tem sessão?
                                ▼       │        ▼
                          login.html    │   mostra biblioteca + lixeira
                                │       │
                    "Criar nova conta"  │
                                ▼       │
                          register.html │
                          (valida Steam ID via API,
                           salva usuário, volta pro login)
                                        │
                          logoff ◄──────┤
                          desligar ─────► crash.html ──(clique/tecla)──► index.html
```

## Tecnologias

| Tech | Uso no projeto |
|---|---|
| **HTML5** | Estrutura semântica, `<dialog>`, `<template>`, `<time>`, formulário, tabela, listas ordenadas/não ordenadas |
| **CSS3** | Variáveis (`tokens.css`), Grid, Flexbox, gradientes pra imitar o tema Luna do XP, `@media` para responsividade, `popover` |
| **JavaScript (módulos ES)** | Sem framework — `fetch`, `localStorage`/`sessionStorage`, `<template>` + `cloneNode`, manipulação de `<dialog>` |
| **API pública da Steam** (`steam-api-swart.vercel.app`) | Busca nome de usuário e biblioteca de jogos a partir do Steam ID |

Nenhuma dependência instalada — tudo roda direto no navegador.

## Estrutura de pastas

```
index.html          # apresentação do projeto (essa página)
loading.html         # tela de boot
login.html            # seleção de conta
register.html         # cadastro / "instalação"
desktop.html           # área de trabalho (app principal)
crash.html              # tela azul de erro

css/
  tokens.css          # paleta de cores e fontes (variáveis)
  base.css            # reset
  components/         # pedaços reutilizáveis (botão, input, janela, taskbar, label)
  pages/              # estilo específico de cada página

js/
  storage.js          # localStorage (usuários) e sessionStorage (sessão)
  api.js              # fetch na API da Steam
  pages/              # um script por página, só a lógica daquela tela

public/imgs/          # ícones, avatares, prints e wallpaper
```

## Explicando o código

**`js/storage.js`** — camada única de acesso a `localStorage`/`sessionStorage`. Todo o resto do app lê/escreve usuário e sessão só por aqui, então trocar a forma de persistir dado (ex.: um backend de verdade) mexe num arquivo só.

**`js/api.js`** — uma função, `getGames(steamId)`, chama a API pública e devolve `{ name, games }`. Usada tanto no cadastro (valida o Steam ID) quanto no desktop (carrega a biblioteca).

**`js/pages/register.js`** — valida usuário duplicado, chama `getGames` pra confirmar que o Steam ID existe, salva o usuário com `saveUsers` e manda pro login. Se a API falhar (ID inválido), mostra erro sem sair da página.

**`js/pages/login.js`** — renderiza um `<li>` por usuário salvo a partir de um `<template>`, abre o formulário de senha da conta clicada, confere a senha e cria a sessão.

**`js/pages/desktop.js`** — é o "sistema operacional": carrega a sessão, busca a biblioteca via API, popula a janela da Steam e a da Lixeira (filtrando jogos com `playtime_forever_minutes === 0`), liga o relógio da taskbar e escuta cliques nos ícones pra abrir as janelas (`<dialog>.show()`).

**`js/pages/crash.js`** — acha o jogo mais jogado da sessão e monta a mensagem de erro em cima dele. Reinicia ao apertar qualquer tecla ou clicar.

## Responsividade

Breakpoints em `@media (max-width: 640px)` (e `720px` no cadastro) cobrindo:
- empilhamento das colunas de login (`welcome`/`accounts`) e cadastro (`aside`/`main`);
- janelas da área de trabalho reposicionadas pra não nascerem fora da tela em celular;
- grid de tecnologias e cards de telas já eram fluidos por padrão (`auto-fit`).

## Como rodar

Não precisa de build nem servidor. Duas opções:

```bash
# opção 1: abrir direto
start index.html        # Windows
# opção 2: live server (recomendado, evita problema de cache/module CORS)
npx serve .
```

## Créditos

- Wallpaper da área de trabalho: foto de licença livre (Unsplash License), trocada porque o original "Bliss" do Windows XP é copyright da Microsoft/Getty Images.
- Ícones de tecnologia: [Simple Icons](https://simpleicons.org) via CDN.
- Dados de jogos: API pública da Steam (`steam-api-swart.vercel.app`).
- Windows XP, Steam e suas marcas pertencem à Microsoft e à Valve, respectivamente — projeto sem fins comerciais.

## Checklist da atividade

| Critério | Onde |
|---|---|
| 5+ páginas | `index`, `loading`, `login`, `register`, `desktop`, `crash` |
| Comentários no código | CSS (`register.css`, `login.css`, `desktop.css`, `tokens.css`) |
| Lista ordenada e não ordenada | `<ol class="roadmap">` / várias `<ul>` |
| Formulário 5+ campos | `register.html`: usuário, email, senha, avatar, Steam ID |
| Tabela | Lixeira em `desktop.html` |
| Formatação de fonte/texto/cor/fundo | Em todo o CSS |
| 5+ funcionalidades JS | login, cadastro+API, biblioteca/lixeira, crash dinâmico, relógio |
| Criatividade | Tema Steam disfarçada de Windows XP |

---

Projeto educacional, disciplina EXAPE.
