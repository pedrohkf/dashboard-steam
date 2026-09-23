import { getGames } from "../api.js";
import { getSession, clearSession } from "../storage.js";

// Página de "tela azul" falsa. Elemento onde a mensagem personalizada é injetada.
const message = document.querySelector(".message");

// Sem sessão salva, mantém a mensagem genérica do HTML e não busca dados da Steam.
const session = getSession();
if (session) loadStats(session);

// Busca os jogos do usuário e personaliza a mensagem com o jogo mais jogado.
async function loadStats(session) {
    try {
        const { games } = await getGames(session.steamid);
        if (!games.length) return; // sem jogos, nada para destacar

        // Jogo com mais minutos jogados vira o "culpado" pelo crash.
        const top = games.reduce((a, b) => b.playtime_forever_minutes > a.playtime_forever_minutes ? b : a);

        message.textContent = `Verifique se há jogos novos que você nunca abriu na Lixeira. Se o problema continuar, desinstale o ${top.name} (${Math.round(top.playtime_forever_minutes / 60)} h) e considere uma atividade ao ar livre.`;
    } catch (error) {
        console.error(error);
    }
}

// Encerra a sessão e devolve para a tela inicial.
function restart() {
    clearSession();
    location.href = "index.html"
}

// Qualquer tecla ou clique "sai" da falsa tela de crash (só dispara uma vez).
addEventListener("keydown", restart, { once: true });
addEventListener("click", restart, { once: true });
