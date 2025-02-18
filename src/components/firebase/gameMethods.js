import { ref, get } from "firebase/database";
import { database } from "./firebaseConfig";
import { playerUid, playerName, fetchPlayerData } from "./playerMethods";

async function getSetupData(gameId) {
  const players = await getPlayers(gameId);
  switch (players.length) {
    case 1: {
      return {
        position: [0, 2, 4.4],
        lookAt: [0, 0, -5],
        multiplier: [1, 1, 1],
        directionalLightPosition: [0, 2, 2.4],
      };
    }
    case 2: {
      return {
        position: [0, 2, -4.4],
        lookAt: [0, 0, 5],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [0, 2, -2.4],
      };
    }
    default: {
      return { position: [0, 2, 4.4] };
    }
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

export { getSetupData };
