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
  playerData.host = true;

  const newGameRef = push(gamesRef);
  try {
    await set(newGameRef, {
      host: playerData.name,
      uid: playerData.uid,
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
    playerData.host = false;
    if (!playerData || !playerData.uid) {
      throw new Error("Invalid player data");
    }
    await update(gameRef, { [playerData.uid]: playerData });
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

async function leaveGame(gameId, playerId) {
  if (!gameId || !playerId) {
    console.error("Invalid gameId or playerId");
    return;
  }

  const playerInGameRef = ref(database, `games/${gameId}/players/${playerId}`);
  const gameRef = ref(database, `games/${gameId}`);

  try {
    await remove(playerInGameRef);

    const gameSnapshot = await get(gameRef);
    if (gameSnapshot.exists()) {
      const gameData = gameSnapshot.val();
      if (!gameData.players || Object.keys(gameData.players).length === 0) {
        await remove(gameRef);
      }
    }
  } catch (error) {
    console.error("Error leaving game:", error);
  }
}

function setupDisconnectHandlers(gameId, playerId) {
  if (!gameId || !playerId) return;

  const playerInGameRef = ref(database, `games/${gameId}/players/${playerId}`);

  const onDisconnectRef = onDisconnect(playerInGameRef);

  onDisconnectRef.remove();

  window.addEventListener("beforeunload", async (event) => {
    await leaveGame(gameId, playerId);
  });

  return () => {
    window.removeEventListener("beforeunload", async (event) => {
      await leaveGame(gameId, playerId);
    });
  };
}

export { newGame, getGames, joinToGame, leaveGame };
