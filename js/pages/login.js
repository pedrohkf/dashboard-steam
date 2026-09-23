import { getUsers, setSession } from "../storage.js";

const template = document.querySelector("template");
const list = document.querySelector(".accounts ul");
const error = document.querySelector("[role=alert]");

// Clona o <template> do login.html uma vez por usuario cadastrado e monta a lista de contas.
getUsers().forEach(user => {
    const item = template.content.cloneNode(true);
    const tile = item.querySelector(".user");
    const form = item.querySelector("form")

    item.querySelector("img").src = `public/imgs/avatars/${user.avatar}.png`;
    item.querySelector("span").textContent = user.username;

    tile.addEventListener("click", () => openTile(tile));

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const password = new FormData(form).get("password");

        // Senha errada: mostra alerta e limpa o campo, sem sair da tela.
        if (password !== user.password) {
            error.hidden = false;
            form.reset();
            form.querySelector("input").focus();
            return;
        }

        // Senha certa: grava sessão (usada pelas outras paginas pra saber quem esta logado) e entra.
        setSession({ username: user.username, avatar: user.avatar, steamid: user.steamid, steamName: user.steamName });
        location.href = "desktop.html"
    })

    list.append(item);
});


// Abre o form de senha da conta clicada e fecha o das demais (só uma expandida por vez).
function openTile(tile) {
    list.querySelectorAll(".user").forEach(t => {
        const isOpen = t === tile;
        t.setAttribute("aria-expanded", isOpen);
        t.nextElementSibling.hidden = !isOpen;
    })

    error.hidden = true;
    tile.nextElementSibling.querySelector("input").focus();
}