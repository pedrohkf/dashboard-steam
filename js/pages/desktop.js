//importando funcoes de outros documento
import { clearSession, getSession } from "../storage.js";
import { getGames } from "../api.js";

// selecionando elemento relogio
const clock = document.querySelector(".clock");
// pegando json do localstorage
const session = getSession();

//se nao possui nada em session significa que o usuario nao logou, redireciona para pagina de login, se nao continua e vai para funcao init
if (!session) location.replace("login.html");
else init(session);

// funcao que cria uma data atual converte em uma cadeia de data todo junta  2026-09-23T14:30:00.000Z
// depois ele converte na data local do Brasil com 2 digitos de horario e 2 de minutos
function updateClock() {
    const now = new Date();
    clock.dateTime = now.toISOString();
    clock.textContent = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

//chama a funcao de atualizar o relogio uma vez e depois a funcao setInterval esta setada para chamar novamente a cada 30s
updateClock()
setInterval(updateClock, 30000)

// funcao de inicio da tela. Seleciona o menu inciar e seta o avatar e nome dele, com os dados que vem de session, no cado o nome do arquivo avatar
// e nome do usuario. Logo apos ele tenta chamar a funcao de buscar jogos passando o id da conta steam, se der certo ele chama mais duas funcoes para renderizar isso
// se ele tentar isso e der errado  ele retorna o erro no console do navegador e mostra uma mensagem, isso caso o id da conta estaja errado ou falha na chamada
async function init(session) {
    document.querySelector(".start-menu__user img").src = `public/imgs/avatars/${session.avatar}.png`;
    document.querySelector(".start-menu__user span").textContent = session.username;

    try {
        const { games } = await getGames(session.steamid);
        renderSteam(games);
        renderTrash(games);
    } catch (error) {
        console.error(error);
        document.querySelector(".games").textContent = "Não foi possível carregar os jogos.";
    }
}

// funcao de renderizacao na janela steam, ele recebe o objeto de jogos como parametro, ele seleciona o p e coloca o nome da conta steam nele
// depois ele seleciona a lista ul dos jogos e o templete que criamos e nao e renderizado no html
// ele faz espalha e copia o array jogos para poder usar as funcoes sort e forEach
// fazemos um sort pegando de 2 em 2 elementos vendo quais tem mais horas que os outros e assim ordenando, sort e uma funcao de ordenacao
// forEach para cada jogo que ele passa ele copia o template, pega a hora de jogo e converte em local BR com 1 digito depois da virgula
// adiciona ao template uma imagem, nome e horas que vem do objeto da api da STEAM
// por fim ele insere o item da li na lista ul games
function renderSteam(games) {
    document.querySelector(".steam-name").textContent = session.steamName;

    const list = document.querySelector(".games");
    const template = document.querySelector("#game-template");

    [...games]
        .sort((a, b) => b.playtime_forever_minutes - a.playtime_forever_minutes)
        .forEach(game => {
            const item = template.content.cloneNode(true);
            const hours = (game.playtime_forever_minutes / 60).toLocaleString("pt-BR", { maximumFractionDigits: 1 });

            item.querySelector("img").src = game.banner_url;
            item.querySelector(".game__name").textContent = game.name;
            item.querySelector(".game__hours").textContent = `${hours} h`;
            list.append(item)
        })
}

//muito paracido com a outra, selecionamos os elementos que vamos adicionar novas coisas com js, como a tabela e o template
// pegamos os games que ja temos da api e agora aplicamos um filtro nele com o parametro de um tempo de jogo ser 0 ele retorna esse elemento em um array
// vamos passar por cada elemento do array e para cada execucao ele cria um linha copiado o nosso template
// selecionamos a linha do template e adicionamos o nome do jogo, e depois inserimos essa linha na nossa tabela 
// por fim vemos quantos elementos tem nesse array com o length e adicionamos esse numero ao nossa linha destinada a isso
function renderTrash(games) {
    const body = document.querySelector("#win-trash tbody");
    const template = document.querySelector("#trash-template");
    const unplayed = games.filter(game => game.playtime_forever_minutes === 0);

    unplayed.forEach(game => {
        const row = template.content.cloneNode(true);
        row.querySelector("td").textContent = game.name;
        body.append(row);
    })

    document.querySelector("#trash-count").textContent = unplayed.length;
}

//adicionamos um evento de click e um parametro de evento assim que ele for clicadoe ele seleciona icone com o parametro data-open,
// se ele existir pegamos o id da janela que ele possui id, e "abrimos" a janela principal do dialog em modo nao modal atraves do click no icone
document.addEventListener("click", (e) => {
    const icon = e.target.closest("[data-open]");
    if (icon) document.getElementById(icon.dataset.open).show()
})

// selecionamos o elemento do menu esvaziar lixeira e adicionamos um evento de click nele, colocamos um modal de confirmacao de ele clicou em sim
// vai retornar true e se for true ele da um alert de aviso
document.querySelector("#empty-trash").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir permanentemente estes itens?")) {
        alert("Brincadeira! seus jogos continuam na sua biblioteca.")
    }
})

// selecionamos o elemento com o texto de sair da conta, e adicionamos um evento de click nele, caso seja clicado
// ele chama a funcao de limpar sessao e depois redireciona para a pagina de login
document.querySelector("#logoff").addEventListener("click", () => {
    clearSession();
    location.href = "login.html"
})