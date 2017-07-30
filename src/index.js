const gamesListEl = document.getElementById("games");

function listGame(game) {
    const listEl = document.createElement("li");

    const linkEl = document.createElement("a");
    linkEl.href = "play.html?game=" + encodeURIComponent(game.play.url);

    const gameNameEl = document.createElement("span");
    gameNameEl.innerHTML = game.name;
    gameNameEl.classList.add("game-title");
    linkEl.appendChild(gameNameEl);

    const authorNameEl = document.createElement("span");
    authorNameEl.innerHTML = game.author;
    authorNameEl.classList.add("game-author");
    linkEl.appendChild(authorNameEl);

    const gameDescriptionEl = document.createElement("div");
    gameDescriptionEl.innerHTML = game.description;
    gameDescriptionEl.classList.add("game-description");
    linkEl.appendChild(gameDescriptionEl);

    listEl.appendChild(linkEl);

    gamesListEl.appendChild(listEl);
}

const gamesListReq = new XMLHttpRequest();
gamesListReq.onreadystatechange = function() {
    if (this.readyState === 4) {
        const parsedResponse = JSON.parse(this.responseText);
        parsedResponse.games.forEach(listGame);
    }
};

gamesListReq.open("GET", "api/games");
gamesListReq.send();
