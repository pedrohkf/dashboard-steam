export async function getGames(steamId) {
    const response = await fetch(`https://steam-api-swart.vercel.app/api/games?steamid=${steamId}`);
    if (!response.ok) throw new Error("Steam ID não encontrado");
    return response.json();
}