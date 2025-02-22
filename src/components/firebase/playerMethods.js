import { ref, set, update, get, onDisconnect, remove } from "firebase/database";
import { database } from "./firebaseConfig";

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
  await update(playerRef, updateObj);
}

async function removePlayerFromGame(playerUid) {
  const gameId = window.location.href.split("/").pop();
  const playerRef = ref(database, `games/${gameId}/players/${playerUid}`);
  await remove(playerRef);
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

export {
  setPlayerData,
  setPlayerName,
  getUserCount,
  fetchPlayerData,
  addAnimationToOtherPlayers,
  getAnimations,
  removePlayerFromGame,
  updatePlayerInGame,
};
