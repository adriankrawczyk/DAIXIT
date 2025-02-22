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
    direction: "Bottom",
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
        direction: "Top",
      };
    }
    case 2: {
      return {
        playerPosition: 2,
        position: [4.4, 2, 0],
        lookAt: [-5, 0, 0],
        multiplier: [1, 1, -1],
        directionalLightPosition: [2.4, 2, 0],
        cardsPosition: [3, 0.75, 0],
        cardsRotation: [-Math.PI / 16, Math.PI / 2, Math.PI / 8],
        direction: "Left",
      };
    }
    case 3: {
      return {
        playerPosition: 3,
        position: [-4.4, 2, 0],
        lookAt: [-5, 0, 0],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [-2.4, 2, 0],
        cardsPosition: [-3, 0.75, 0],
        cardsRotation: [Math.PI / 16, -Math.PI / 2, Math.PI / 8],
        direction: "Right",
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
  const snapshot = await get(playerCurrentGameDataRef);
  if (!snapshot.val()) return;
  try {
    await update(playerCurrentGameDataRef, { hand });
  } catch (error) {
    console.error("Error fetching player position:", error);
    return null;
  }
}

async function getOtherPlayersData() {
  const playerId = localStorage.getItem("playerUid");
  if (!playerId) return [];
  const gameId = window.location.href.split("/").pop();

  const playersRef = ref(database, `games/${gameId}/players`);
  const snapshot = await get(playersRef);
  const hands = [];

  if (!snapshot.val()) return [];

  for (const [key, value] of Object.entries(snapshot.val())) {
    if (key !== playerId) hands.push(value.currentGameData);
  }
  return hands;
}

function getRandomCard(allPhotos) {
  const randomIndex = Math.floor(Math.random() * allPhotos.length);
  return allPhotos[randomIndex];
}

async function getHandFromDatabase() {
  const playerCurrentGameDataRef = await getPlayersCurrentGameDataRef();
  const snapshot = await get(playerCurrentGameDataRef);
  const val = snapshot.val();
  if (!val) return [];
  const hand = val.hand;
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

const calculateCardsLayout = (playerSetup, numberOfCards) => {
  if (!playerSetup) return [];

  const { cardsPosition, cardsRotation, direction } = playerSetup;

  return Array.from({ length: numberOfCards }, (_, i) => ({
    position: getCardsPosition(cardsPosition, i, direction),
    rotation: cardsRotation,
  }));
};
function getCardsPosition(cardsPosition, i, direction) {
  if (direction === "Bottom" || direction === "Top")
    return [
      (i - 2) / 2 + cardsPosition[0],
      cardsPosition[1],
      i * 0.01 + cardsPosition[2],
    ];
  else {
    return [
      i * 0.01 + cardsPosition[0],
      cardsPosition[1],
      (i - 2) / 2 + cardsPosition[2],
    ];
  }
}
export {
  getPosition,
  setHandInDatabase,
  getRandomCard,
  fetchAllPhotos,
  getHandFromDatabase,
  getOtherPlayersData,
  getSetupData,
  calculateCardsLayout,
  getCardsPosition,
};
