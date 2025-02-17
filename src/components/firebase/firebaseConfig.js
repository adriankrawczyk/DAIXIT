import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD85eTRocsjNq7BPaEyHU9zwRKjUrZYIxw",
  authDomain: "daixit-70e54.firebaseapp.com",
  databaseURL: "https://daixit-70e54-default-rtdb.firebaseio.com",
  projectId: "daixit-70e54",
  storageBucket: "daixit-70e54.appspot.com",
  messagingSenderId: "628264390852",
  appId: "1:628264390852:web:9a1d730f3c3a82151c3991",
  measurementId: "G-EVWM9T483Q",
};

let playerUid;

function setPlayerData(newUID) {
  playerUid = newUID;
  const playerRef = ref(database, `players/${playerUid}`);
  set(playerRef, {
    uid: playerUid,
    joinedAt: new Date().toISOString(),
  });
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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export {
  database,
  auth,
  get,
  signInAnonymously,
  onAuthStateChanged,
  setPlayerData,
  setPlayerName,
  getUserCount,
};
