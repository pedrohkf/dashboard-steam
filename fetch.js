const nameElement = document.querySelector(".name");
const container = document.querySelector(".games");

async function fetchGameData() {
    try {
        const response = await fetch("http://localhost:3000/api/games?steamid=76561199387600663");
        const data = await response.json();

        console.log(data);

        nameElement.textContent = data.name;
        data.games.forEach((game, indice) => {
            const h1 = document.createElement("p")
            const img = document.createElement("img")
            h1.textContent = game.name
            img.src = game.banner_url
            container.append(h1)
            container.append(img)
        }
        )
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchGameData();