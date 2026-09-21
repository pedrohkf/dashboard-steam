import { getGames } from "../api.js";
import { getSession, clearSession } from "../storage.js";

const message = document.querySelector("message");

const session = getSession();
if (session) loadStats(session);

async function loadStats(session) {
    try {
        const { games } = await getGames(session.steamid);
        if (!games.length) return;

        const top = games.reduce((a, b) => b.playtime_foraver_minutes > a.playtime_foraver_minutes ? b : a);

        message.textContent = `Verifique se há jogos novos que você nunca abriu na Lixeira. Se o problema continuar, 
        desinstale o ${top.name} (${Math.round(top.playtime_forever_minutes / 60)} h) e considere uma atividade ao ar livre.`;
    } catch (error) {
        console.log(error);
    }
}

function restart() {
    clearSession();
    location.href = "loading.html"
}

addEventListener("keydown", restart, { once: true });
addEventListener("click", restart, { once: true });
