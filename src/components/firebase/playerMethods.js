import { ref, set, update, get, onDisconnect } from "firebase/database";
import { database } from "./firebaseConfig";

let playerUid = localStorage.getItem("playerUid");
let playerName;

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
  playerUid = newUID;
  localStorage.setItem("playerUid", playerUid);
  const playerRef = ref(database, `players/${playerUid}`);
  set(playerRef, {
    uid: playerUid,
    joinedAt: new Date().toISOString(),
    name: localStorage.getItem("name"),
  });
  onDisconnect(playerRef).remove();
}

function setPlayerName(newPlayerName) {
  playerName = newPlayerName;
  const playerRef = ref(database, `players/${playerUid}`);
  update(playerRef, { name: playerName }).catch((error) =>
    console.error("Error updating player name:", error)
  );
}

async function getUserCount() {
  const playersRef = ref(database, "players");

  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const userCount = Object.keys(snapshot.val()).length;
      return userCount;
    } else {
      console.log("No users found.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching user count:", error);
    return null;
  }
}

export {
  playerUid,
  playerName,
  setPlayerData,
  setPlayerName,
  getUserCount,
  fetchPlayerData,
};
