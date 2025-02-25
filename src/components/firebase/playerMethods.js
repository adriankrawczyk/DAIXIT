import { ref, set, update, get, onDisconnect, remove } from "firebase/database";
import { database } from "./firebaseConfig";
import _ from "lodash";

async function fetchPlayerData(chosenUid) {
  const playerRef = ref(database, `players/${chosenUid}`);
  try {
    const snapshot = await get(playerRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return "";
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
  }
}

async function setPlayerData(newUID) {
  localStorage.setItem("playerUid", newUID);
  const playerRef = ref(database, `players/${newUID}`);
  await set(playerRef, {
    uid: newUID,
    joinedAt: new Date().toISOString(),
    name: localStorage.getItem("name"),
    loggedIn: true,
  });

  const onDisconnectRef = onDisconnect(playerRef);
  onDisconnectRef.update({ loggedIn: false });
}

async function setPlayerName(newPlayerName) {
  const playerUid = localStorage.getItem("playerUid");
  const playerRef = ref(database, `players/${playerUid}`);
  await update(playerRef, { name: newPlayerName }).catch((error) =>
    console.error("Error updating player name:", error)
  );
}

async function updatePlayerInGame(playerUid, updateObj) {
  const gameId = window.location.href.split("/").pop();
  const playerRef = ref(database, `games/${gameId}/players/${playerUid}`);
  const snapshot = await get(playerRef);
  if (!snapshot.val()) return;
  await update(playerRef, updateObj);
}

async function updateThisPlayerInGame(updateObj) {
  const playerUid = localStorage.getItem("playerUid");
  await updatePlayerInGame(playerUid, updateObj);
}

async function removePlayerFromGame(playerUid) {
  const gameId = window.location.href.split("/").pop();
  const playerRef = ref(database, `games/${gameId}/players/${playerUid}`);
  await remove(playerRef);
}

async function getPlayerInGame(playerUid) {
  const gameId = window.location.href.split("/").pop();
  const playerRef = ref(database, `games/${gameId}/players/${playerUid}`);
  const snapshot = await get(playerRef);
  return snapshot.val();
}

async function getUserCount() {
  const playersRef = ref(database, "players");

  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const loggedInCount = Object.values(users).filter(
        (user) => user.loggedIn === true
      ).length;
      return loggedInCount;
    } else {
      console.log("No users found.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user count:", error);
    return null;
  }
}

async function addAnimationToOtherPlayers(animation) {
  const gameId = window.location.href.split("/").pop();
  const gameRef = ref(database, `games/${gameId}/players`);
  const currentPlayerUid = localStorage.getItem("playerUid");
  try {
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) return;
    const players = snapshot.val();
    const updates = {};
    const timestamp = Date.now();
    animation.timestamp = timestamp;
    Object.entries(players).forEach(([uid, playerData]) => {
      if (uid !== currentPlayerUid) {
        updates[`games/${gameId}/players/${uid}/animations/${timestamp}`] =
          animation;
      }
    });
    await update(ref(database), updates);
  } catch (error) {
    console.error("Error updating animations for players:", error);
  }
}

async function getAnimations() {
  const gameId = window.location.href.split("/").pop();
  const playerUid = localStorage.getItem("playerUid");

  if (!playerUid) {
    console.error("No playerUid found in localStorage");
    return [];
  }

  const playerRef = ref(database, `games/${gameId}/players/${playerUid}`);
  const animationsRef = ref(
    database,
    `games/${gameId}/players/${playerUid}/animations`
  );

  try {
    const snapshot = await get(animationsRef);
    if (!snapshot.exists()) return [];

    const animationsObj = snapshot.val();
    const animationsArray = Object.values(animationsObj);

    await set(animationsRef, null);

    return animationsArray;
  } catch (error) {
    console.error("Error retrieving animations:", error);
    return [];
  }
}
async function updatePoints(playerUid, amount) {
  const playerInDatabase = await getPlayerInGame(playerUid);
  await updatePlayerInGame(playerUid, {
    points: playerInDatabase.points + amount,
  });
}
async function calculateAndAddPoints() {
  const gameId = window.location.href.split("/").pop();
  const playersRef = ref(database, `games/${gameId}/players`);
  const snapshot = await get(playersRef);
  const players = Object.values(snapshot.val());
  const playersCount = players.length;
  const wordMaker = players.find((player) => player.wordMaker === true);
  const rightCard = wordMaker?.chosenCard;
  const allCards = {};
  const pointsToUpdate = {}; // Object to store playerUid -> points to add

  // Initialize points for all players
  players.forEach((player) => {
    pointsToUpdate[player.playerUid] = 0;
  });

  // Process right card
  if (rightCard) {
    allCards[rightCard.playerUid] = {
      card: rightCard,
      isCorrectCard: true,
      voters: [],
    };
  }

  // Process all cards and voters
  players.forEach((player) => {
    if (!player.wordMaker && player.votingSelectedCardData) {
      const cardId = player.votingSelectedCardData.playerUid;
      if (!allCards[cardId]) {
        allCards[cardId] = {
          card: player.votingSelectedCardData,
          isCorrectCard: cardId === rightCard?.playerUid,
          voters: [],
        };
      }
      allCards[cardId].voters.push({
        playerUid: player.playerUid,
        position: player.currentGameData.position,
        name: player.name,
      });
    }
  });

  // Log all card data
  Object.entries(allCards).forEach(([cardId, data]) => {
    console.log(data);
  });

  // Calculate right card picks count
  let rightCardPicksCount = 1; // Starting with 1 to account for the wordMaker
  if (rightCard) {
    const rightCardVoters = allCards[rightCard.playerUid]?.voters || [];
    rightCardPicksCount += rightCardVoters.length;
  }

  // Determine if everyone besides wordMaker gets points
  const everyoneBesidesWordMakerGetPoints =
    rightCardPicksCount === playersCount || rightCardPicksCount === 1;

  // Calculate points for each player
  players.forEach((player) => {
    // Case 1: Points for non-wordMaker players when everyone or no one guessed correctly
    if (!player.wordMaker && everyoneBesidesWordMakerGetPoints) {
      pointsToUpdate[player.playerUid] += 2; // No one or everybody guessed the right card
    }
    // Case 2: Points for wordMaker or for players who guessed correctly
    else if (
      (player.wordMaker && !everyoneBesidesWordMakerGetPoints) ||
      (!player.wordMaker &&
        player.votingSelectedCardData?.playerUid === rightCard?.playerUid)
    ) {
      pointsToUpdate[player.playerUid] += 3; // Some people guessed the right card
    }

    // Case 3: Points for players whose cards were chosen by others
    if (
      !player.wordMaker &&
      player.votingSelectedCardData?.playerUid !== rightCard?.playerUid
    ) {
      // Give points to the owner of the wrong card that was selected
      pointsToUpdate[player.votingSelectedCardData.playerUid] += 1; // Wrong card votes
    }
  });

  // Update all points at once
  const updatePromises = Object.entries(pointsToUpdate).map(
    ([playerUid, points]) => {
      if (points > 0) {
        return updatePoints(playerUid, points);
      }
      return Promise.resolve();
    }
  );

  // Wait for all updates to complete
  await Promise.all(updatePromises);

  return Object.values(allCards);
}

export {
  setPlayerData,
  setPlayerName,
  getUserCount,
  fetchPlayerData,
  addAnimationToOtherPlayers,
  getAnimations,
  removePlayerFromGame,
  updatePlayerInGame,
  updateThisPlayerInGame,
  calculateAndAddPoints,
};
