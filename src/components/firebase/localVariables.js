let playerUid;
let currentGame;

function setCurrentGame(newCurrentGame) {
  currentGame = newCurrentGame;
}

function setPlayerUid(newUid) {
  playerUid = newUid;
}

export { playerUid, setPlayerUid, setCurrentGame, currentGame };
