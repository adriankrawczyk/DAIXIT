import {
  ref,
  set,
  update,
  get,
  push,
  onDisconnect,
  remove,
} from "firebase/database";
import { database } from "./firebaseConfig";
import { fetchPlayerData } from "./playerMethods";

async function newGame() {
  const playerUid = localStorage.getItem("playerUid");
  if (!playerUid) {
    console.error("No player UID found in localStorage");
    return null;
  }

  const gamesRef = ref(database, "games");
  const playerData = await fetchPlayerData(playerUid);
  if (!playerData || !playerData.uid) {
    console.error("Invalid player data");
    return null;
  }

  const newGameRef = await push(gamesRef);
  try {
    await set(newGameRef, {
      host: playerData.name,
      hostUid: playerData.uid,
      gameId: newGameRef.key,
      started: false,
      chosenWord: "",
      votingPhase: false,
      round: 0,
      players: {},
      afterVoteData: {},
    });
    setupDisconnectHandlers(newGameRef.key, playerData.uid);
    return newGameRef.key;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
}

async function joinToGame(gameId) {
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  const gameData = snapshot.val();
  if (gameData.started) return;

  try {
    const playerUid = localStorage.getItem("playerUid");
    if (!playerUid) {
      throw new Error("No player UID found in localStorage");
    }

    const playerData = await fetchPlayerData(playerUid);
    localStorage.setItem("currentGame", gameId);
    if (!playerData || !playerData.uid) {
      throw new Error("Invalid player data");
    }

    const { name } = playerData;
    const players = await getPlayersInGame(gameId);
    const playersArray = players ? Object.values(players) : [];

    const currentGameData = {
      position: playersArray.length,
    };

    const playerInGameRef = ref(
      database,
      `games/${gameId}/players/${playerUid}`
    );
    const playerInGameRefSnapshot = await get(playerInGameRef);
    const playerInGameData = playerInGameRefSnapshot.val();
    if (!playerInGameData)
      await update(playerInGameRef, {
        currentGameData,
        chosenCard: {},
        wordMaker: false,
        points: 0,
        pointsInThisRound: 0,
      });

    await update(playerInGameRef, {
      playerUid,
      name,
      inGame: true,
    });

    onDisconnect(playerInGameRef).update({ inGame: false });

    setupDisconnectHandlers(gameId, playerUid);
  } catch (error) {
    console.error("Error updating player data:", error);
  }
}

async function getGames() {
  const gamesRef = ref(database, "games");

  try {
    const snapshot = await get(gamesRef);
    const gamesObject = snapshot.val();
    if (!gamesObject) return [];

    const gamesArray = [];

    for (const [gameId, gameData] of Object.entries(gamesObject)) {
      const players = gameData.players || {};

      const allPlayersInactive =
        Object.values(players).length > 0 &&
        Object.values(players).every((player) => !player.inGame);
      if (allPlayersInactive && Object.values(players).length > 0) {
        await remove(ref(database, `games/${gameId}`)); // temporary fix
      } else if (!gameData.started) {
        gamesArray.push({ ...gameData });
      }
    }

    return gamesArray;
  } catch (error) {
    console.error("Error fetching games:", error);
    return [];
  }
}

async function fetchGameData() {
  const gameId = window.location.href.split("/").pop();
  const gameRef = ref(database, `games/${gameId}`);
  const gameSnapshot = await get(gameRef);
  return gameSnapshot.val() || {};
}

async function getPlayersInGame(gameId) {
  const playersRef = ref(database, `games/${gameId}/players`);
  const playersSnapshot = await get(playersRef);
  return playersSnapshot.val() || {};
}

async function getActivePlayersInGame(gameId) {
  const players = await getPlayersInGame(gameId);
  return Object.values(players).filter((player) => player.inGame);
}

async function leaveGame(gameId, playerId) {
  if (!gameId || !playerId) {
    console.error("Invalid gameId or playerId");
    return;
  }

  const gameRef = ref(database, `games/${gameId}`);
  const playerInGameRef = ref(database, `games/${gameId}/players/${playerId}`);

  await update(playerInGameRef, { inGame: false });
  localStorage.removeItem("currentGame");

  const activePlayers = await getActivePlayersInGame(gameId);
  if (activePlayers.length === 0) {
    await remove(gameRef);
  }
}

function setupDisconnectHandlers(gameId, playerId) {
  if (!gameId || !playerId) return;

  window.addEventListener("beforeunload", () => {
    leaveGame(gameId, playerId);
  });

  return () => {
    window.removeEventListener("beforeunload", () => {
      leaveGame(gameId, playerId);
    });
  };
}

export {
  newGame,
  getGames,
  joinToGame,
  leaveGame,
  getActivePlayersInGame,
  fetchGameData,
};
