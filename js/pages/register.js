import { getGames } from "../api.js";
import { getUsers, saveUsers } from "../storage.js";

const form = document.querySelector("form");
const status = document.querySelector("[role=status]");
const button = form.querySelector("[type=submit]")

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";


    const data = Object.fromEntries(new FormData(form));
    data.username = data.username.trim()

    const exists = getUsers().some(u => u.username === data.username)
    if (exists) return showError("Este nome de usuário já existe.");

    button.disabled = true;
    try {
        const { name } = await getGames(data.steamid);
        saveUsers({ ...data, steamName: name });
        location.href = "login.html"
    } catch {
        button.disabled = false;
        status.hidden = false;
        status.textContent = "Chave do produto inválida.";
    }
})

function showError(message){
    status.textContent = message;
    status.hidden = false;
    status.disabled = false;
}