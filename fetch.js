fetch("https://steam-api-swart.vercel.app/api/games?steamid=76561199387600663")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))