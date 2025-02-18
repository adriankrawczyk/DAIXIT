import { ref, set, update, get, onDisconnect } from "firebase/database";
import { database } from "./firebaseConfig";

let playerUid;
let playerName;

function setPlayerData(newUID) {
  playerUid = newUID;
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

export { playerUid, playerName, setPlayerData, setPlayerName, getUserCount };
