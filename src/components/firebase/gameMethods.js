import { ref, get } from "firebase/database";
import { database } from "./firebaseConfig";
import { setPlayerName } from "./playerMethods";
import FirebaseLogger from "../lobby/firebase/firebaseLogger";

async function getSetupData(gameId) {
  const players = await getPlayers(gameId);
  const defaultObj = {
    position: [0, 2, 4.4],
    lookAt: [0, 0, -5],
    multiplier: [1, 1, 1],
    directionalLightPosition: [0, 2, 2.4],
    cardsPosition: [0, 0, 0],
    cardsRotation: [0, 0, 0],
  };
  switch (players.length) {
    case 1: {
      return defaultObj;
    }
    case 2: {
      return {
        position: [0, 2, -4.4],
        lookAt: [0, 0, 5],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [0, 2, -2.4],
        cardsPosition: [0, 0, 0],
        cardsRotation: [0, Math.PI, 0],
      };
    }
    default: {
      return defaultObj;
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
