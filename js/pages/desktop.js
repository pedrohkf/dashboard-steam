import { clearSession, getSession } from "../storage.js";
import { getGames } from "../api.js";

const clock = document.querySelector(".clock");
const session = getSession();

if (!session) location.replace("login.html");
else init(session);


function updateClock() {
    const now = new Date();
    clock.dataTime = now.toISOString();
    clock.textContent = now.toLocaleDateString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

updateClock()
setInterval(updateClock, 30000)

async function init(session) {
    document.querySelector(".start-menu__user img").src = `public/imgs/avatars/${session.avatar}.png`;
    document.querySelector(".start-menu__user span").textContent = session.username;

    try {
        const { games } = await getGames(session.steamid);
        renderSteam(games);
        renderTrash(games);
    } catch (error) {
        console.error(error);
        document.querySelector(".games").textContent = "Não foi possível carregar os jogos.";
    }
}

function renderSteam(games) {
    document.querySelector(".steam-name").textContent = session.steamName;

    const list = document.querySelector(".games");
    const template = document.querySelector("#game-template");

    [...games]
        .sort((a, b) => b.playtime_forever_minutes - a.playtime_forever_minutes)
        .forEach(game => {
            const item = template.content.cloneNode(true);
            const hours = (game.playtime_forever_minutes / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 });

            item.querySelector("img").src = game.banner_url;
            item.querySelector(".game__name").textContent = game.name;
            item.querySelector(".game__hours").textContent = `${hours} h`;
            list.append(item)
        })
}

function renderTrash(games) {
    const body = document.querySelector("#win-trash tbody");
    const template = document.querySelector("#trash-template");
    const unplayed = games.filter(game => game.playtime_forever_minutes === 0);

    unplayed.forEach(game => {
        const row = template.content.cloneNode(true);
        row.querySelector("td").textContent = game.name;
        body.append(row);
    })

    document.querySelector("#trash-count").textContent = unplayed.length;
}

document.addEventListener("click", (e) => {
    const icon = e.target.closest("[data-open]");
    if (icon) document.getElementById(icon.dataset.open).show()
})

document.querySelector("#empty-trash").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir permanentemente estes itens?")) {
        alert("Brincadeira! seus jogos continuam na sua biblioteca.")
    }
})

document.querySelector("#logoff").addEventListener("click", () => {
    clearSession();
    location.href = "login.html"
})