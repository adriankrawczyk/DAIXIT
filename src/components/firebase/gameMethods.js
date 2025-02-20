import { ref, get } from "firebase/database";
import { database } from "./firebaseConfig";
import { setPlayerName } from "./playerMethods";
import FirebaseLogger from "../lobby/firebase/firebaseLogger";

async function getSetupData(n) {
  const defaultObj = {
    playerPosition: 0,
    position: [0, 2, 4.4],
    lookAt: [0, 0, -5],
    multiplier: [1, 1, 1],
    directionalLightPosition: [0, 2, 2.4],
    cardsPosition: [0, 0.75, 3],
    cardsRotation: [-Math.PI / 8, 0, Math.PI / 16],
  };
  switch (n) {
    case 0: {
      return defaultObj;
    }
    case 1: {
      return {
        playerPosition: 1,
        position: [0, 2, -4.4],
        lookAt: [0, 0, 5],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [0, 2, -2.4],
        cardsPosition: [0, 0.75, -3],
        cardsRotation: [Math.PI / 8, Math.PI, Math.PI / 16],
      };
    }
    default: {
      return defaultObj;
    }
  }
}

async function getPosition() {
  const gameId = window.location.href.split("/").pop();
  const playerId = localStorage.getItem("playerUid");
  if (!gameId || !playerId) {
    console.error("Missing gameId or playerId in localStorage");
    return null;
  }

  const currentGameDataRef = ref(
    database,
    `games/${gameId}/players/${playerId}/currentGameData`
  );

  try {
    const gameDataSnapshot = await get(currentGameDataRef);
    const gameData = gameDataSnapshot.val();

    if (!gameData || typeof gameData.position === "undefined") {
      console.error("Invalid game data or position not found");
      return null;
    }

    return getSetupData(gameData.position);
  } catch (error) {
    console.error("Error fetching player position:", error);
    return null;
  }
}

async function getPlayers(gameId) {
  const playersRef = ref(database, `games/${gameId}/players`);
  const snapshot = await get(playersRef);
  const playersObject = snapshot.val();
  const playersObjectArray = Object.entries(playersObject).map(
    ([id, data]) => ({
      ...data,
    })
  );
  return playersObjectArray;
}
export { getPosition };
