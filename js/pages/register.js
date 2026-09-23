import { getGames } from "../api.js";
import { getUsers, saveUsers } from "../storage.js";

const form = document.querySelector("form");
const status = document.querySelector("[role=status]");
const button = form.querySelector("[type=submit]")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";


    // FormData vira objeto simples { username, email, password, avatar, steamid }
    const data = Object.fromEntries(new FormData(form));
    data.username = data.username.trim()

    // Username duplicado nao pode: bloqueia antes de gastar chamada de API.
    const exists = getUsers().some(u => u.username === data.username)
    if (exists) return showError("Este nome de usuário já existe.");

    button.disabled = true;
    try {
        // getGames também serve pra validar se o steamid existe de verdade;
        // se a Steam responder, aproveita o nome do perfil (steamName).
        const { name } = await getGames(data.steamid);
        saveUsers({ ...data, steamName: name });
        location.href = "login.html"
    } catch {
        // steamid invalido ou API falhou: reabilita o botao e avisa o usuario.
        button.disabled = false;
        status.hidden = false;
        status.textContent = "Chave do produto inválida.";
    }
})

// Mostra mensagem de erro no <p role="status"> (ex: username repetido).
function showError(message){
    status.textContent = message;
    status.hidden = false;
    status.disabled = false;
}