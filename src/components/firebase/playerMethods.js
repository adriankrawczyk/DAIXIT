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
    pointsInThisRound: amount,
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
  const pointsToUpdate = {};

  players.forEach((player) => {
    pointsToUpdate[player.playerUid] = 0;
  });

  players.forEach((player) => {
    if (player.chosenCard) {
      allCards[player.playerUid] = {
        card: player.chosenCard,
        isCorrectCard: player.playerUid === rightCard?.playerUid,
        voters: [],
        playerName: player.name,
      };
    }
  });

  players.forEach((player) => {
    if (!player.wordMaker && player.votingSelectedCardData) {
      const cardId = player.votingSelectedCardData.playerUid;
      allCards[cardId].voters.push({
        playerUid: player.playerUid,
        position: player.currentGameData.position,
        name: player.name,
      });
    }
  });

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

async function handleNextRound() {
  const gameId = window.location.href.split("/").pop();
  const gameRef = ref(database, `games/${gameId}`);
  const snapshot = await get(gameRef);
  const gameData = snapshot.val();
  const prevRound = gameData.round;

  // Get all players to determine next wordMaker
  const playersRef = ref(database, `games/${gameId}/players`);
  const playersSnapshot = await get(playersRef);
  const players = playersSnapshot.val();

  // Find current wordMaker and determine next one
  let currentWordMakerPosition = -1;
  let playerPositions = [];
  let updates = {};

  Object.values(players).forEach((player) => {
    playerPositions.push({
      playerUid: player.playerUid,
      position: player.currentGameData.position,
    });

    if (player.wordMaker === true) {
      currentWordMakerPosition = player.currentGameData.position;
      // Reset current wordMaker
      updates[`games/${gameId}/players/${player.playerUid}/wordMaker`] = false;
    }

    // Reset chosenCard for all players
    updates[`games/${gameId}/players/${player.playerUid}/chosenCard`] = {};

    // Remove the selected card from hand
    if (
      player.chosenCard &&
      player.currentGameData &&
      player.currentGameData.hand
    ) {
      const handCards = [...player.currentGameData.hand];
      const cardToRemoveUrl = player.chosenCard.url;
      const updatedHand = handCards.filter(
        (cardUrl) => cardUrl !== cardToRemoveUrl
      );
      updates[
        `games/${gameId}/players/${player.playerUid}/currentGameData/hand`
      ] = updatedHand;
    }

    // Reset voting data
    updates[
      `games/${gameId}/players/${player.playerUid}/votingSelectedCardData`
    ] = null;
    updates[
      `games/${gameId}/players/${player.playerUid}/pointsInThisRound`
    ] = 0;
  });

  // Sort players by position to determine next wordMaker
  playerPositions.sort((a, b) => a.position - b.position);
  const playerCount = playerPositions.length;

  // Calculate next wordMaker position (wrap around if needed)
  const nextWordMakerPosition = (currentWordMakerPosition + 1) % playerCount;

  // Find player with that position
  const nextWordMakerPlayer = playerPositions.find(
    (player) => player.position === nextWordMakerPosition
  );

  // Set new wordMaker
  if (nextWordMakerPlayer) {
    updates[
      `games/${gameId}/players/${nextWordMakerPlayer.playerUid}/wordMaker`
    ] = true;
  }

  // Update game state
  updates[`games/${gameId}/chosenWord`] = "";
  updates[`games/${gameId}/round`] = prevRound + 1;
  updates[`games/${gameId}/afterVoteData`] = {};
  updates[`games/${gameId}/votingPhase`] = false;

  // Apply all updates at once
  await update(ref(database), updates);
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
  handleNextRound,
};
