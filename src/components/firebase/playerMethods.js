import { ref, set, update, get, onDisconnect } from "firebase/database";
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
  set(playerRef, {
    uid: newUID,
    joinedAt: new Date().toISOString(),
    name: localStorage.getItem("name"),
    loggedIn: true,
  });

  const onDisconnectRef = onDisconnect(playerRef);

  onDisconnectRef.update({ loggedIn: false });
}

function setPlayerName(newPlayerName) {
  const playerUid = localStorage.getItem("playerUid");
  const playerRef = ref(database, `players/${playerUid}`);
  update(playerRef, { name: newPlayerName }).catch((error) =>
    console.error("Error updating player name:", error)
  );
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

export { setPlayerData, setPlayerName, getUserCount, fetchPlayerData };
