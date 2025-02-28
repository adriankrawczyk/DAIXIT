import { ref, get, update } from "firebase/database";
import { database } from "./firebaseConfig";
import { setPlayerName } from "./playerMethods";
import FirebaseLogger from "../lobby/firebase/firebaseLogger";
const CAMERA_HEIGHT = 2;
const CAMERA_DISTANCE = 6;
const LOOK_AT_DISTANCE = 5;
const DIRECTIONAL_LIGHT_HEIGHT = 2;
const DIRECTIONAL_LIGHT_DISTANCE = 3;
const CARDS_HEIGHT = 0.75;
const CARDS_DISTANCE = 4.5;
const DIAGONAL_DISTANCE = 4;
const DIAGONAL_LOOK_AT = 3.5;
const DIAGONAL_CARDS_DISTANCE = 3.25;
const ROTATION_EIGHTH_PI = Math.PI / 8;
const ROTATION_SIXTEENTH_PI = Math.PI / 16;
const ROTATION_QUARTER_PI = Math.PI / 4;
const ROTATION_HALF_PI = Math.PI / 2;
const ROTATION_THREE_QUARTER_PI = Math.PI * 0.75;
const ROTATION_PI = Math.PI;

async function getSetupData(n) {
  if (n == 0) {
    n = 4;
  } else if (n == 1) {
    n = 0;
  }
  const defaultObj = {
    playerPosition: 0,
    position: [0, CAMERA_HEIGHT, CAMERA_DISTANCE],
    lookAt: [0, 0, -LOOK_AT_DISTANCE],
    multiplier: [1, 1, 1],
    directionalLightPosition: [
      0,
      DIRECTIONAL_LIGHT_HEIGHT,
      DIRECTIONAL_LIGHT_DISTANCE,
    ],
    cardsPosition: [0, CARDS_HEIGHT, CARDS_DISTANCE],
    cardsRotation: [-ROTATION_EIGHTH_PI, 0, ROTATION_SIXTEENTH_PI],
    direction: "Bottom",
  };

  switch (n) {
    case 0: {
      return defaultObj;
    }
    case 1: {
      return {
        playerPosition: 1,
        position: [0, CAMERA_HEIGHT, -CAMERA_DISTANCE],
        lookAt: [0, 0, LOOK_AT_DISTANCE],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [
          0,
          DIRECTIONAL_LIGHT_HEIGHT,
          -DIRECTIONAL_LIGHT_DISTANCE,
        ],
        cardsPosition: [0, CARDS_HEIGHT, -CARDS_DISTANCE],
        cardsRotation: [ROTATION_EIGHTH_PI, ROTATION_PI, ROTATION_SIXTEENTH_PI],
        direction: "Top",
      };
    }
    case 2: {
      return {
        playerPosition: 2,
        position: [CAMERA_DISTANCE, CAMERA_HEIGHT, 0],
        lookAt: [-LOOK_AT_DISTANCE, 0, 0],
        multiplier: [1, 1, -1],
        directionalLightPosition: [
          DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          0,
        ],
        cardsPosition: [CARDS_DISTANCE, CARDS_HEIGHT, 0],
        cardsRotation: [
          -ROTATION_SIXTEENTH_PI,
          ROTATION_HALF_PI,
          ROTATION_EIGHTH_PI,
        ],
        direction: "Left",
      };
    }
    case 3: {
      return {
        playerPosition: 3,
        position: [-CAMERA_DISTANCE, CAMERA_HEIGHT, 0],
        lookAt: [-LOOK_AT_DISTANCE, 0, 0],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [
          -DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          0,
        ],
        cardsPosition: [-CARDS_DISTANCE, CARDS_HEIGHT, 0],
        cardsRotation: [
          ROTATION_SIXTEENTH_PI,
          -ROTATION_HALF_PI,
          ROTATION_EIGHTH_PI,
        ],
        direction: "Right",
      };
    }
    case 4: {
      return {
        playerPosition: 4,
        position: [DIAGONAL_DISTANCE, CAMERA_HEIGHT, DIAGONAL_DISTANCE],
        lookAt: [-DIAGONAL_LOOK_AT, 0, DIAGONAL_LOOK_AT],
        multiplier: [1, 1, -1],
        directionalLightPosition: [
          DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          DIRECTIONAL_LIGHT_DISTANCE,
        ],
        cardsPosition: [
          DIAGONAL_CARDS_DISTANCE,
          CARDS_HEIGHT,
          DIAGONAL_CARDS_DISTANCE,
        ],
        cardsRotation: [
          -ROTATION_SIXTEENTH_PI,
          ROTATION_QUARTER_PI,
          ROTATION_SIXTEENTH_PI,
        ],
        direction: "LeftBottom",
      };
    }
    case 5: {
      return {
        playerPosition: 5,
        position: [DIAGONAL_DISTANCE, CAMERA_HEIGHT, -DIAGONAL_DISTANCE],
        lookAt: [-DIAGONAL_LOOK_AT, 0, DIAGONAL_LOOK_AT],
        multiplier: [1, 1, 1],
        directionalLightPosition: [
          DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          -DIRECTIONAL_LIGHT_DISTANCE,
        ],
        cardsPosition: [
          DIAGONAL_CARDS_DISTANCE,
          CARDS_HEIGHT,
          -DIAGONAL_CARDS_DISTANCE,
        ],
        cardsRotation: [
          ROTATION_SIXTEENTH_PI,
          ROTATION_THREE_QUARTER_PI,
          ROTATION_SIXTEENTH_PI,
        ],
        direction: "LeftTop",
      };
    }
    case 6: {
      return {
        playerPosition: 6,
        position: [-DIAGONAL_DISTANCE, CAMERA_HEIGHT, -DIAGONAL_DISTANCE],
        lookAt: [DIAGONAL_LOOK_AT, 0, DIAGONAL_LOOK_AT],
        multiplier: [-1, 1, 1],
        directionalLightPosition: [
          -DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          -DIRECTIONAL_LIGHT_DISTANCE,
        ],
        cardsPosition: [
          -DIAGONAL_CARDS_DISTANCE,
          CARDS_HEIGHT,
          -DIAGONAL_CARDS_DISTANCE,
        ],
        cardsRotation: [
          ROTATION_SIXTEENTH_PI,
          -ROTATION_THREE_QUARTER_PI,
          ROTATION_SIXTEENTH_PI,
        ],
        direction: "RightTop",
      };
    }
    case 7: {
      return {
        playerPosition: 7,
        position: [-DIAGONAL_DISTANCE, CAMERA_HEIGHT, DIAGONAL_DISTANCE],
        lookAt: [DIAGONAL_LOOK_AT, 0, -DIAGONAL_LOOK_AT],
        multiplier: [-1, 1, -1],
        directionalLightPosition: [
          -DIRECTIONAL_LIGHT_DISTANCE,
          DIRECTIONAL_LIGHT_HEIGHT,
          DIRECTIONAL_LIGHT_DISTANCE,
        ],
        cardsPosition: [
          -DIAGONAL_CARDS_DISTANCE,
          CARDS_HEIGHT,
          DIAGONAL_CARDS_DISTANCE,
        ],
        cardsRotation: [
          -ROTATION_SIXTEENTH_PI,
          -ROTATION_QUARTER_PI,
          ROTATION_SIXTEENTH_PI,
        ],
        direction: "RightBottom",
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

// async function fetchAllPhotos() {
//   const baseUrl = "https://storage.googleapis.com/storage/v1/b/daixit_photos/o";
//   let allPhotos = [];
//   let nextPageToken = null;
//   try {
//     do {
//       const url = nextPageToken
//         ? `${baseUrl}?pageToken=${nextPageToken}`
//         : baseUrl;
//       const response = await fetch(url);
//       const data = await response.json();
//       if (data.items) {
//         allPhotos.push(
//           ...data.items.map(
//             (item) =>
//               `https://storage.googleapis.com/daixit_photos/${item.name}`
//           )
//         );
//       }
//       nextPageToken = data.nextPageToken || null;
//     } while (nextPageToken);

//     return allPhotos;
//   } catch (error) {
//     console.error("Error fetching photos:", error);
//     return [];
//   }
// }
// async function fetchAllPhotos() {
//   const url = "https://storage.googleapis.com/storage/v1/b/daixit_photos/o";
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     return data.items.map(
//       (item) => `https://storage.googleapis.com/daixit_photos/${item.name}`
//     );
//   } catch (error) {
//     console.error("Error fetching photos:", error);
//     return [];
//   }
// }
async function fetchAllPhotos() {
  const baseUrl = "https://storage.googleapis.com/storage/v1/b/daixit_photos/o";
  const pageTokensRef = ref(database, "pageTokens");

  try {
    const pageTokensSnapshot = await get(pageTokensRef);
    let pageTokens = pageTokensSnapshot.val();

    if (!pageTokens || !pageTokens.tokens || pageTokens.tokens.length === 0) {
      let allPhotos = [];
      let nextPageToken = null;
      pageTokens = { tokens: [] };

      do {
        const url = nextPageToken
          ? `${baseUrl}?pageToken=${nextPageToken}`
          : baseUrl;
        const response = await fetch(url);
        const data = await response.json();

        if (data.items) {
          allPhotos.push(
            ...data.items.map(
              (item) =>
                `https://storage.googleapis.com/daixit_photos/${item.name}`
            )
          );
        }

        if (data.nextPageToken) {
          pageTokens.tokens.push(data.nextPageToken);
        }

        nextPageToken = data.nextPageToken || null;
      } while (nextPageToken);

      await update(pageTokensRef, pageTokens);

      return allPhotos;
    } else {
      const randomPageToken =
        pageTokens.tokens[Math.floor(Math.random() * pageTokens.tokens.length)];
      const url = `${baseUrl}?pageToken=${randomPageToken}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.items) {
        return data.items.map(
          (item) => `https://storage.googleapis.com/daixit_photos/${item.name}`
        );
      } else {
        console.error("No items found in the random page.");
        return [];
      }
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}
async function getPlayers() {
  const gameId = window.location.href.split("/").pop();
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
  if (direction === "Bottom" || direction === "Top") {
    return [
      (i - 2) / 2 + cardsPosition[0],
      cardsPosition[1],
      i * 0.01 + cardsPosition[2],
    ];
  } else if (direction === "Left" || direction === "Right") {
    return [
      i * 0.01 + cardsPosition[0],
      cardsPosition[1],
      (i - 2) / 2 + cardsPosition[2],
    ];
  } else {
    const offsetFactor = 0.707;

    if (direction === "LeftBottom" || direction === "RightTop") {
      return [
        cardsPosition[0] + i * 0.01 + ((i - 2) / 2) * offsetFactor,
        cardsPosition[1],
        cardsPosition[2] - i * 0.01 - ((i - 2) / 2) * offsetFactor,
      ];
    } else if (direction === "LeftTop" || direction === "RightBottom") {
      return [
        cardsPosition[0] + i * 0.01 + ((i - 2) / 2) * offsetFactor,
        cardsPosition[1],
        cardsPosition[2] - i * 0.01 + ((i - 2) / 2) * offsetFactor,
      ];
    }
  }
}
async function updateGameWithData(updateObj) {
  const gameId = window.location.href.split("/").pop();
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  if (!snapshot.val()) return;
  await update(gameRef, updateObj);
}

async function getOtherPlayerSelectedCards() {
  const playerUid = localStorage.getItem("playerUid");
  const playersData = await getPlayers();
  const selectedCards = [];

  playersData.forEach((playerData) => {
    if (
      String(playerData.playerUid) !== String(playerUid) &&
      playerData.chosenCard &&
      Object.values(playerData.chosenCard).length
    ) {
      selectedCards.push(playerData.chosenCard);
    }
  });
  return selectedCards;
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
  updateGameWithData,
  getOtherPlayerSelectedCards,
};
