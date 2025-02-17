import { useEffect } from "react";
import {
  auth,
  signInAnonymously,
  onAuthStateChanged,
  setPlayerData,
} from "../../firebase/firebaseConfig";

const FirebaseLogger = () => {
  useEffect(() => {
    signInAnonymously(auth).catch((error) =>
      console.error("Auth Error:", error)
    );

    const unsubscribe = onAuthStateChanged(auth, (player) => {
      if (player) {
        setPlayerData(player.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default FirebaseLogger;
