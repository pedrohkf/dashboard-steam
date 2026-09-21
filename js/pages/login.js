import { getUsers, setSession } from "../storage.js";

const template = document.querySelector("template");
const list = document.querySelector(".accounts ul");
const error = document.querySelector("[role=alert]");

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

        if (password !== user.password) {
            error.hidden = false;
            form.reset();
            form.querySelector("input").focus();
            return;
        }

        setSession({ username: user.username, avatar: user.avatar, steamid: user.steamid, steamName: user.steamName });
        location.href = "desktop.html"
    })

    list.append(item);
});


function openTile(tile) {
    list.querySelectorAll(".user").forEach(t => {
        const isOpen = t === tile;
        t.setAttribute("aria-expanded", isOpen);
        t.nextElementSibling.hidden = !isOpen;
    })

    error.hidden = true;
    t.nextElementSibling.querySelector("input").focus();
}