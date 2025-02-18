import { ref, set, update, get, push } from "firebase/database";
import { database } from "./firebaseConfig";
import { playerUid, playerName, fetchPlayerData } from "./playerMethods";

async function newGame() {
  const gamesRef = ref(database, "games");
  const playerData = await fetchPlayerData(playerUid);
  const newGameRef = push(gamesRef);
  try {
    await set(newGameRef, {
      host: playerData.name,
      uid: playerUid,
      gameId: newGameRef.key,
      players: [playerData],
    });
    return newGameRef.key;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
}

async function joinToGame(gameId) {
  const gameRef = ref(database, `games/${gameId}`);
  const playerData = await fetchPlayerData(playerUid);
  update(gameRef, { players: [...playerData] }).catch((error) =>
    console.error("Error updating player name:", error)
  );
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
