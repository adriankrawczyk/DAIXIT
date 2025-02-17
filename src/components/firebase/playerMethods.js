import { ref, set, update, get, onDisconnect } from "firebase/database";
import { database } from "./firebaseConfig";

let playerUid;

function setPlayerData(newUID) {
  playerUid = newUID;
  const playerRef = ref(database, `players/${playerUid}`);
  set(playerRef, {
    uid: playerUid,
    joinedAt: new Date().toISOString(),
  });
  onDisconnect(playerRef).remove();
}

function setPlayerName(playerName) {
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
      console.log(`Total users: ${userCount}`);
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

export { setPlayerData, setPlayerName, getUserCount };
