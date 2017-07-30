const TIME_TAKEN_PER_LETTER_WRITTEN_IN_MS = 10;

function findGetParameter(parameterName) {
    var result = null,
	tmp = [];
    location.search
	.substr(1)
	.split("&")
	.forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
	});
    return result;
}

const gameAreaEl = document.getElementById("game-output");
const gameOutputEl = document.getElementById("text");
const userInputEl = document.getElementById("user-input");


function createServerOutputElement() {
    const serverEl = document.createElement("span");
    serverEl.setAttribute("from", "server");
    
    gameOutputEl.appendChild(serverEl);
    
    return serverEl;
}

let currentServerOutput = createServerOutputElement();

let charactersWaitingToBeWritten = [];

setInterval(function() {
    if (charactersWaitingToBeWritten.length > 0) {
	currentServerOutput.innerHTML += charactersWaitingToBeWritten.shift();
    }
}, TIME_TAKEN_PER_LETTER_WRITTEN_IN_MS);


function writeGameText(text) {
    text.split("").forEach(function(c) { charactersWaitingToBeWritten.push(c); });
}

function writePlayerText(text) {
    currentServerOutput.innerHTML += charactersWaitingToBeWritten.join("");
    charactersWaitingToBeWritten = [];

    const textEl = document.createElement("div");
    textEl.innerText = text;
    textEl.setAttribute("from", "player");

    gameOutputEl.appendChild(textEl);
    currentServerOutput = createServerOutputElement();
}

function onPlayerKeydown(e) {
    const keyPressed = e.key;

    if (keyPressed === "Enter") {
	writePlayerText(userInputEl.value);
	gameSocket.send(userInputEl.value);
	userInputEl.value = "";
    }
}


userInputEl.addEventListener("keydown", onPlayerKeydown);

const gamePath = findGetParameter("game");

const gameUrl = (window.location.protocol.match(/^https/) !== null) ?
	  "wss://" + window.location.host + "/api" + gamePath :
	  "ws://" + window.location.host + "/api" + gamePath;

const gameSocket = new WebSocket(gameUrl);
gameSocket.onopen = function() {};
gameSocket.onclose = function(e) {
    writeGameText("Game ended: " + e.reason);
    userInputEl.disabled = true;
    userInputEl.placeholder = "The game has ended";
    userInputEl.removeEventListener("keydown", onPlayerKeydown);
    
    const replayButton = document.createElement("button");
    replayButton.onclick = function() {
	window.location = window.location;
    };
    replayButton.innerText = "Replay";
    replayButton.classList.add("replay-btn");

    gameAreaEl.appendChild(document.createElement("br"));
    gameAreaEl.appendChild(replayButton);
};
gameSocket.onmessage = function(event) {
    writeGameText(event.data);
    document.body.scrollTop = document.body.scrollHeight;
};
