import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const updateUserStatus = async (change) => {
  const usersRef = ref(database, "DAIXIT");
  const snapshot = await get(usersRef);
  const currentUsers = snapshot.exists() ? snapshot.val() : 0;
  await set(usersRef, Math.max(0, currentUsers + change));
};

export { database, updateUserStatus };
