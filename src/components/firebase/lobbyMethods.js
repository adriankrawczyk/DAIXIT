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
  const gamesRef = ref(database, "games");
  const playerData = await fetchPlayerData(playerUid);
  const newGameRef = push(gamesRef);
  try {
    await set(newGameRef, {
      host: playerData.name,
      hostUid: playerData.uid,
      gameId: newGameRef.key,
      players: {},
    });
    setupDisconnectHandlers(newGameRef.key, playerData.uid);
    return newGameRef.key;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
}

async function joinToGame(gameId) {
  try {
    const playerUid = localStorage.getItem("playerUid");
    const gameRef = ref(database, `games/${gameId}/players`);
    const playerData = await fetchPlayerData(playerUid);
    playerData.inGame = true;
    if (!playerData || !playerData.uid) {
      throw new Error("Invalid player data");
    }
    const { name } = playerData;
    await update(gameRef, { [playerData.uid]: { name, inGame: true } });
    setupDisconnectHandlers(gameId, playerData.uid);
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
    const gamesArray = Object.entries(gamesObject).map(([id, data]) => ({
      ...data,
    }));

    return gamesArray;
  } catch (error) {
    console.error("Error fetching games:", error);
    return null;
  }
}
async function getActivePlayersInGame(gameId) {
  const playersRef = ref(database, `games/${gameId}/players`);
  const playersSnapshot = await get(playersRef);
  const players = playersSnapshot.val();
  return Object.values(players).filter((player) => player.inGame === true)
    .length;
}

async function leaveGame(gameId, playerId) {
  if (!gameId || !playerId) {
    console.error("Invalid gameId or playerId");
    return;
  }
  const playerInGameRef = ref(database, `games/${gameId}/players/${playerId}`);
  localStorage.setItem("currentGame", false);
  await update(playerInGameRef, { inGame: false });
  const gameRef = ref(database, `games/${gameId}`);
  if ((await getActivePlayersInGame(gameId)) === 0) await remove(gameRef);
}

function setupDisconnectHandlers(gameId, playerId) {
  if (!gameId || !playerId) return;

  const playerInGameRef = ref(database, `games/${gameId}/players/${playerId}`);

  const onDisconnectRef = onDisconnect(playerInGameRef);

  //onDisconnectRef.update({ inGame: false });

  window.addEventListener("beforeunload", async (event) => {
    await leaveGame(gameId, playerId);
  });

  return () => {
    window.removeEventListener("beforeunload", async (event) => {
      await leaveGame(gameId, playerId);
    });
  };
}

export { newGame, getGames, joinToGame, leaveGame, getActivePlayersInGame };
