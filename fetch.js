fetch("https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=6D8689F868831603A8AE211A54E3A180&steamid=76561199387600663&format=json")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))