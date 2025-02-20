import { ref, get, update } from "firebase/database";
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
  const playerCurrentGameDataRef = await getPlayersCurrentGameDataRef();

  try {
    const gameDataSnapshot = await get(playerCurrentGameDataRef);
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

async function setHandInDatabase(hand) {
  const playerCurrentGameDataRef = await getPlayersCurrentGameDataRef();
  try {
    await update(playerCurrentGameDataRef, { hand });
  } catch (error) {
    console.error("Error fetching player position:", error);
    return null;
  }
}

function getRandomCard(allPhotos) {
  const randomIndex = Math.floor(Math.random() * allPhotos.length);
  return allPhotos[randomIndex];
}

async function getHandFromDatabase() {
  const playerCurrentGameDataRef = await getPlayersCurrentGameDataRef();
  const snapshot = await get(playerCurrentGameDataRef);
  const hand = snapshot.val().hand;
  if (!hand) return [];
  return Object.values(hand);
}

async function getPlayersCurrentGameDataRef() {
  const playerId = localStorage.getItem("playerUid");
  const gameId = window.location.href.split("/").pop();

  return ref(database, `games/${gameId}/players/${playerId}/currentGameData`);
}

async function fetchAllPhotos() {
  const url = "https://storage.googleapis.com/storage/v1/b/daixit_photos/o";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map(
      (item) => `https://storage.googleapis.com/daixit_photos/${item.name}`
    );
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
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
export {
  getPosition,
  setHandInDatabase,
  getRandomCard,
  fetchAllPhotos,
  getHandFromDatabase,
};
