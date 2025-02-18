import { ref, set, update, get, push } from "firebase/database";
import { database } from "./firebaseConfig";
import { playerUid, playerName, fetchPlayerData } from "./playerMethods";

async function newGame() {
  const gamesRef = ref(database, "games");
  const playerData = await fetchPlayerData(playerUid);
  playerData.host = true;
  const newGameRef = push(gamesRef);
  try {
    await set(newGameRef, {
      host: playerData.name,
      uid: playerUid,
      gameId: newGameRef.key,
      players: {
        [playerData.uid]: playerData,
      },
    });
    return newGameRef.key;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
}

async function joinToGame(gameId) {
  try {
    const gameRef = ref(database, `games/${gameId}/players`);
    const playerData = await fetchPlayerData(playerUid);
    playerData.host = false;

    if (!playerData || !playerData.uid) {
      throw new Error("Invalid player data");
    }

    await update(gameRef, { [playerData.uid]: playerData });
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

// async function getGameById(gameId) {
//   const gameRef = ref(database, `games/${gameId}`);
//   try {
//     const snapshot = await get(gameRef);
//     return snapshot.exists() ? snapshot.val() : null;
//   } catch (error) {
//     console.error("Error fetching game:", error);
//     return null;
//   }
// }

// async function updateGame(gameId, updates) {
//   const gameRef = ref(database, `games/${gameId}`);
//   try {
//     await update(gameRef, updates);
//     return true;
//   } catch (error) {
//     console.error("Error updating game:", error);
//     return false;
//   }
// }

// async function deleteGame(gameId) {
//   const gameRef = ref(database, `games/${gameId}`);
//   try {
//     await remove(gameRef);
//     return true;
//   } catch (error) {
//     console.error("Error deleting game:", error);
//     return false;
//   }
// }

export { newGame, getGames, joinToGame };
