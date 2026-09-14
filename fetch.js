fetch("https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=22548B3C29EA4601ED7793C97E1CBCDF&steamid=76561199387600663&format=json")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))